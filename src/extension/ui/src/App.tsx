import React, { useEffect, useState, Suspense } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, Typography, Button, IconButton, Alert, DialogTitle, Dialog, DialogContent, CircularProgress, Paper, Box, SvgIcon, useTheme } from '@mui/material';
import { CatalogItemWithName } from './components/tile/Tile';
import { Close } from '@mui/icons-material';
import { CatalogGrid } from './components/CatalogGrid';
import { POLL_INTERVAL } from './Constants';
import { CatalogProvider, useCatalogContext } from './context/CatalogContext';
import { MCPClientProvider } from './context/MCPClientContext';
import ConfigurationModal from './components/ConfigurationModal';
import { Settings as SettingsIcon } from '@mui/icons-material';

const Settings = React.lazy(() => import('./components/Settings'));



// Create lazy-loaded logo components
const LazyDarkLogo = React.lazy(() => import('./components/DarkLogo'));
const LazyLightLogo = React.lazy(() => import('./components/LightLogo'));

// Logo component that uses Suspense for conditional loading
const Logo = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Suspense fallback={<Box sx={{ height: '5em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={24} /></Box>}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {isDarkMode ? <LazyDarkLogo /> : <LazyLightLogo />}
      </Box>
    </Suspense>
  );
}

export const client = createDockerDesktopClient();

const DEFAULT_SETTINGS = {
  showModal: false,
  pollIntervalSeconds: POLL_INTERVAL / 1000
}

export function App() {
  const [settings, setSettings] = useState<{ showModal: boolean, pollIntervalSeconds: number }>(localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings') || '{}') : DEFAULT_SETTINGS);
  const [configuringItem, setConfiguringItem] = useState<CatalogItemWithName | null>(null);
  const theme = useTheme();
  // Wrap the entire application with our providers
  return (
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
  );
}

interface AppContentProps {
  settings: { showModal: boolean, pollIntervalSeconds: number };
  setSettings: React.Dispatch<React.SetStateAction<{ showModal: boolean, pollIntervalSeconds: number }>>;
  configuringItem: CatalogItemWithName | null;
  setConfiguringItem: React.Dispatch<React.SetStateAction<CatalogItemWithName | null>>;
}

function AppContent({ settings, setSettings, configuringItem, setConfiguringItem }: AppContentProps) {
  const { imagesLoadingResults, loadImagesIfNeeded, secrets, catalogItems, registryItems, } = useCatalogContext();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  if (!imagesLoadingResults || imagesLoadingResults.stderr) {
    return <Paper sx={{ padding: 2, height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {!imagesLoadingResults && <CircularProgress sx={{ marginBottom: 2 }} />}
      {!imagesLoadingResults && <Typography>Loading images...</Typography>}
      {imagesLoadingResults && <Alert sx={{ fontSize: '1.5em' }} action={<Button variant='outlined' color='secondary' onClick={() => loadImagesIfNeeded()}>Retry</Button>} title="Error loading images" severity="error">{imagesLoadingResults.stderr}</Alert>}
      <Typography>{imagesLoadingResults?.stdout}</Typography>
    </Paper>
  }

  if (!secrets) {
    return <Paper sx={{ padding: 2, height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
      <Typography>Loading secrets...</Typography>
    </Paper>
  }

  if (!catalogItems) {
    return <Paper sx={{ padding: 2, height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
      <Typography>Loading catalog...</Typography>
    </Paper>
  }

  if (!registryItems) {
    return <Paper sx={{ padding: 2, height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
      <Typography>Loading registry...</Typography>
    </Paper>
  }

  return (
    <>
      {settings.showModal && (
        <Dialog open={settings.showModal} fullWidth maxWidth="xl">
          <DialogTitle>
            Settings
            <IconButton
              aria-label="close"
              onClick={() => setSettings({ ...settings, showModal: false })}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
              <Settings
                settings={settings}
                setSettings={setSettings}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      )}

      {/* Replace the old PromptConfig dialog with our new ConfigurationModal */}
      {configuringItem && (
        <ConfigurationModal
          open={configuringItem !== null}
          onClose={() => setConfiguringItem(null)}
          catalogItem={configuringItem}
          client={client}
        />
      )}

      <Stack direction="column" spacing={1} justifyContent='center' alignItems='center'>
        <Stack direction="row" spacing={1} justifyContent='space-evenly' alignItems='center' sx={{ width: '100%', maxWidth: '1000px' }}>
          <Logo />
          <IconButton sx={{ ml: 2, alignSelf: 'flex-end', justifyContent: 'flex-end' }} onClick={() => setSettings({ ...settings, showModal: true })}>
            <SettingsIcon sx={{ fontSize: '1.5em' }} />
          </IconButton>
        </Stack>
        <CatalogGrid
          setConfiguringItem={setConfiguringItem}
          showSettings={() => setSettings({ ...settings, showModal: true })}
        />
      </Stack>
    </>
  );
}