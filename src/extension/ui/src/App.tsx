import React, { useState, Suspense } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Typography, Button, IconButton, Alert, DialogTitle, Dialog, DialogContent, CircularProgress, Paper, Box, SvgIcon, useTheme } from '@mui/material';
import { CatalogItemWithName } from './types/catalog';
import { Close } from '@mui/icons-material';
import { CatalogGrid } from './components/CatalogGrid';
import { POLL_INTERVAL } from './Constants';
import { CatalogProvider, useCatalogContext } from './context/CatalogContext';
import { ConfigProvider } from './context/ConfigContext';
import { MCPClientProvider, useMCPClientContext } from './context/MCPClientContext';
import ConfigurationModal from './components/ConfigurationModal';

export const client = createDockerDesktopClient();

const DEFAULT_SETTINGS = {
  showModal: false,
  pollIntervalSeconds: POLL_INTERVAL / 1000
}

export function App() {
  const [settings, setSettings] = useState<{ showModal: boolean, pollIntervalSeconds: number }>(localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings') || '{}') : DEFAULT_SETTINGS);
  const [configuringItem, setConfiguringItem] = useState<CatalogItemWithName | null>(null);
  // Wrap the entire application with our providers
  return (
    <ConfigProvider client={client}>
      <CatalogProvider client={client}>
        <MCPClientProvider client={client}>
          <AppContent
            settings={settings}
            setSettings={setSettings}
            configuringItem={configuringItem}
            setConfiguringItem={setConfiguringItem}
          />
        </MCPClientProvider>
      </CatalogProvider>
    </ConfigProvider>
  );
}

interface AppContentProps {
  settings: { showModal: boolean, pollIntervalSeconds: number };
  setSettings: React.Dispatch<React.SetStateAction<{ showModal: boolean, pollIntervalSeconds: number }>>;
  configuringItem: CatalogItemWithName | null;
  setConfiguringItem: React.Dispatch<React.SetStateAction<CatalogItemWithName | null>>;
}

function AppContent({ settings, setSettings, configuringItem, setConfiguringItem }: AppContentProps) {
  const {
    imagesLoadingResults,
    loadImagesIfNeeded,
    catalogItems,
  } = useCatalogContext();

  // Instead of showing full-page loading states for each resource, let's implement a more unified approach
  // Only show full-page loading during initial load, not during background refetching
  const isInitialLoading = !catalogItems;

  // Critical error check - only for images as they're required for the app to function
  if (imagesLoadingResults?.stderr) {
    return (
      <Paper sx={{ padding: 2, height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Alert
          sx={{ fontSize: '1.5em' }}
          action={
            <Button variant='outlined' color='secondary' onClick={() => loadImagesIfNeeded()}>
              Retry
            </Button>
          }
          title="Error loading images"
          severity="error"
        >
          {imagesLoadingResults.stderr}
        </Alert>
        <Typography>{imagesLoadingResults?.stdout}</Typography>
      </Paper>
    );
  }

  // Show one unified loading screen during initial load
  if (isInitialLoading) {
    return (
      <Paper sx={{ padding: 2, height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ marginBottom: 2 }} />
        <Typography>Loading application...</Typography>
      </Paper>
    );
  }
  return (
    <>
      {configuringItem && (
        <ConfigurationModal
          open={configuringItem !== null}
          onClose={() => setConfiguringItem(null)}
          catalogItem={configuringItem}
          client={client}
        />
      )}

      <CatalogGrid
        setConfiguringItem={setConfiguringItem}
        showSettings={() => setSettings({ ...settings, showModal: true })}
      />
    </>
  );
}