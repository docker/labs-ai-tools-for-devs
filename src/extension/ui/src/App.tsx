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
import { RequiredImagesProvider, useRequiredImagesContext } from './context/RequiredImageContext';
import ConfigurationModal from './components/tile/Modal';
import LoadingState from './components/LoadingState';

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
      <RequiredImagesProvider client={client}>
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
      </RequiredImagesProvider>
    </ConfigProvider>
  );
}

interface AppContentProps {
  settings: { showModal: boolean, pollIntervalSeconds: number };
  setSettings: React.Dispatch<React.SetStateAction<{ showModal: boolean, pollIntervalSeconds: number }>>;
  configuringItem: CatalogItemWithName | null;
  setConfiguringItem: React.Dispatch<React.SetStateAction<CatalogItemWithName | null>>;
}

function AppContent({ settings, setSettings, setConfiguringItem }: AppContentProps) {
  const { secretsLoading, catalogLoading, registryLoading } = useCatalogContext();
  const { isLoading: imagesLoading } = useRequiredImagesContext();

  const isLoading = secretsLoading || catalogLoading || registryLoading || imagesLoading;

  return (
    <>
      {isLoading ? (
        <LoadingState />
      ) : (
        <CatalogGrid
          setConfiguringItem={setConfiguringItem}
          showSettings={() => setSettings({ ...settings, showModal: true })}
        />
      )}
    </>
  );
}