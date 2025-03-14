import React, { useEffect, useState, Suspense } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, Typography, Button, IconButton, Alert, DialogTitle, Dialog, DialogContent, CircularProgress, Paper, Box } from '@mui/material';
import { CatalogItemWithName } from './components/tile/Tile';
import { Close } from '@mui/icons-material';
import { CatalogGrid } from './components/CatalogGrid';
import { POLL_INTERVAL } from './Constants';
import MCPCatalogLogo from './MCP Catalog.svg'
import { getMCPClientStates, MCPClientState } from './MCPClients';
import { CatalogProvider, useCatalogContext } from './context/CatalogContext';
import ConfigurationModal from './components/ConfigurationModal';

const Settings = React.lazy(() => import('./components/Settings'));

export const client = createDockerDesktopClient();

const DEFAULT_SETTINGS = {
  showModal: false,
  pollIntervalSeconds: POLL_INTERVAL / 1000
}

export function App() {
  const [settings, setSettings] = useState<{ showModal: boolean, pollIntervalSeconds: number }>(localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings') || '{}') : DEFAULT_SETTINGS);
  const [mcpClientStates, setMcpClientStates] = useState<{ [name: string]: MCPClientState }>({});
  const [configuringItem, setConfiguringItem] = useState<CatalogItemWithName | null>(null);

  const updateMCPClientStates = async () => {
    const oldStates = mcpClientStates;
    const states = await getMCPClientStates(client)
    setMcpClientStates(states);
    // Whenever a client connection changes, show toast to user
    if (Object.values(oldStates).some(state => state.exists && !state.configured) && Object.values(states).every(state => state.configured)) {
      client.desktopUI.toast.success('MCP Client Connected. Restart Claude Desktop to use the MCP Catalog.');
    }
    if (Object.values(oldStates).some(state => state.exists && state.configured) && Object.values(states).every(state => !state.configured)) {
      client.desktopUI.toast.error('MCP Client Disconnected. Restart Claude Desktop to remove the MCP Catalog.');
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    updateMCPClientStates();
    interval = setInterval(() => {
      updateMCPClientStates();
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Wrap the entire application with our CatalogProvider
  return (
    <CatalogProvider client={client}>
      <AppContent
        settings={settings}
        setSettings={setSettings}
        mcpClientStates={mcpClientStates}
        configuringItem={configuringItem}
        setConfiguringItem={setConfiguringItem}
        updateMCPClientStates={updateMCPClientStates}
      />
    </CatalogProvider>
  );
}

interface AppContentProps {
  settings: { showModal: boolean, pollIntervalSeconds: number };
  setSettings: React.Dispatch<React.SetStateAction<{ showModal: boolean, pollIntervalSeconds: number }>>;
  mcpClientStates: { [name: string]: MCPClientState };
  configuringItem: CatalogItemWithName | null;
  setConfiguringItem: React.Dispatch<React.SetStateAction<CatalogItemWithName | null>>;
  updateMCPClientStates: () => Promise<void>;
}

function AppContent({ settings, setSettings, mcpClientStates, configuringItem, setConfiguringItem, updateMCPClientStates }: AppContentProps) {
  const { imagesLoadingResults, loadImagesIfNeeded, secrets, tryUpdateSecrets, tryUpdateCatalog, catalogItems, registryItems } = useCatalogContext();

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

  const hasMCPConfigured = Object.values(mcpClientStates).some(state => state.exists && state.configured);

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
                mcpClientStates={mcpClientStates}
                onUpdate={updateMCPClientStates}
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
          secrets={secrets}
          onSecretChange={tryUpdateSecrets}
        />
      )}

      <Stack direction="column" spacing={1} justifyContent='center' alignItems='center'>
        <img src={MCPCatalogLogo} alt="MCP Catalog" height={100} />
        {hasMCPConfigured ? <></> : <Alert action={<Button variant='outlined' color='secondary' onClick={() => setSettings({ ...settings, showModal: true })}>Configure</Button>} severity="error" sx={{ fontWeight: 'bold' }}>MCP Clients are not configured.  Please configure MCP Clients to use the MCP Catalog.</Alert>}
        <CatalogGrid
          settingsBadgeProps={hasMCPConfigured ? {} : {
            color: hasMCPConfigured ? 'default' : 'error',
            badgeContent: '0 MCP Clients',
            sx: {
              width: 80,
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
          setConfiguringItem={setConfiguringItem}
          showSettings={() => setSettings({ ...settings, showModal: true })}
        />
      </Stack>
    </>
  );
}