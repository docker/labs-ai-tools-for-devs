import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, Typography, Button, ButtonGroup, Grid, debounce, Card, CardContent, IconButton, Alert, DialogTitle, Dialog, DialogContent, FormControlLabel, Checkbox, CircularProgress, Paper, DialogActions } from '@mui/material';
import { CatalogItemWithName } from './components/PromptCard';
import { RegistrySyncStatus } from './components/RegistrySyncStatus';
import { getRegistry } from './Registry';
import { ClaudeConfigSyncStatus, setNeverShowAgain } from './components/ClaudeConfigSyncStatus';
import { Close, FolderOpenRounded, } from '@mui/icons-material';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';
import { CatalogGrid } from './components/CatalogGrid';
import { MCPClient, POLL_INTERVAL } from './Constants';
import MCPCatalogLogo from './MCP Catalog.svg'
import Settings from './components/Settings';
import { getMCPClientStates } from './MCPClients';

export const client = createDockerDesktopClient();

const DEFAULT_SETTINGS = {
  showModal: false,
  pollIntervalSeconds: POLL_INTERVAL / 1000
}

export function App() {
  const [canRegister, setCanRegister] = useState(false);
  const [registryItems, setRegistryItems] = useState<{ [key: string]: { ref: string } }>({});
  const [imagesLoadingResults, setImagesLoadingResults] = useState<ExecResult | null>(null);
  const [settings, setSettings] = useState<{ showModal: boolean, pollIntervalSeconds: number }>(localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings') || '{}') : DEFAULT_SETTINGS);
  const [mcpClientStates, setMcpClientStates] = useState<{ [name: string]: { exists: boolean, configured: boolean } }>({});
  const loadRegistry = async () => {
    setCanRegister(false);
    try {
      const result = await getRegistry(client)
      setRegistryItems(result || {});
    }
    catch (error) {
      if (error instanceof Error) {
        client.desktopUI.toast.error('Failed to get prompt registry: ' + error.message);
      } else {
        client.desktopUI.toast.error('Failed to get prompt registry: ' + JSON.stringify(error));
      }
    }
    setCanRegister(true);
  }

  const startImagesLoading = async () => {
    setImagesLoadingResults(null);
    try {
      const result = await client.docker.cli.exec('pull', ['vonwig/function_write_files:latest'])
      await client.docker.cli.exec('pull', ['alpine:latest'])
      setImagesLoadingResults(result);
    }
    catch (error) {
      console.error(error)
      if (error) {
        setImagesLoadingResults(error as ExecResult)
      }
    }
  }

  useEffect(() => {
    startImagesLoading();
    loadRegistry();
    getMCPClientStates(client).then(setMcpClientStates);
    const interval = setInterval(() => {
      loadRegistry();
      getMCPClientStates(client).then(setMcpClientStates);
    }, POLL_INTERVAL);
    return () => {
      clearInterval(interval)
    }
  }, []);

  if (!imagesLoadingResults || imagesLoadingResults.stderr) {
    return <Paper sx={{ padding: 2, height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {!imagesLoadingResults && <CircularProgress sx={{ marginBottom: 2 }} />}
      {!imagesLoadingResults && <Typography>Loading images...</Typography>}
      {imagesLoadingResults && <Alert sx={{ fontSize: '1.5em' }} action={<Button variant='outlined' color='secondary' onClick={() => startImagesLoading()}>Retry</Button>} title="Error loading images" severity="error">{imagesLoadingResults.stderr}</Alert>}
      <Typography>{imagesLoadingResults?.stdout}</Typography>
    </Paper>
  }

  return (
    <div>
      <Dialog open={settings.showModal} onClose={() => setSettings({ ...settings, showModal: false })}>
        <DialogTitle>
          <Typography variant='h2' sx={{ fontWeight: 'bold', m: 2 }}>Catalog Settings</Typography>
        </DialogTitle>
        <DialogContent>
          <Settings mcpClientStates={mcpClientStates} settings={settings} setSettings={setSettings} />
        </DialogContent>
      </Dialog>
      <Stack direction="column" spacing={1} justifyContent='center' alignItems='center'>
        <img src={MCPCatalogLogo} alt="MCP Catalog" height={100} />
        <CatalogGrid settingsBadgeProps={Object.values(mcpClientStates).some(state => state.exists && state.configured) ? {} : {
          color: Object.values(mcpClientStates).some(state => state.exists) ? 'warning' : 'error',
          badgeContent: '0 MCP Clients',
          sx: {
            width: 80,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }} showSettings={() => setSettings({ ...settings, showModal: true })} registryItems={registryItems} canRegister={canRegister} client={client} onRegistryChange={loadRegistry} />
      </Stack>
    </div>
  )

}