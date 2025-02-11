import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, Typography, Button, ButtonGroup, Grid, debounce, Card, CardContent, IconButton, Alert, DialogTitle, Dialog, DialogContent, FormControlLabel, Checkbox, CircularProgress, Paper } from '@mui/material';
import { CatalogItem, CatalogItemCard, CatalogItemWithName } from './components/PromptCard';
import { parse, stringify } from 'yaml';
import { Ref } from './Refs';
import { RegistrySyncStatus } from './components/RegistrySyncStatus';
import { getRegistry } from './Registry';
import { ClaudeConfigSyncStatus, setNeverShowAgain } from './components/ClaudeConfigSyncStatus';
import { FolderOpenRounded, } from '@mui/icons-material';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';
import Gordon from './components/Gordon';

const NEVER_SHOW_AGAIN_KEY = 'registry-sync-never-show-again';

const client = createDockerDesktopClient();

const CATALOG_URL = 'https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml'

export function App() {

  const [registryLoaded, setRegistryLoaded] = useState(false);
  const [catalogItems, setCatalogItems] = useState<CatalogItemWithName[]>([]);
  const [canRegister, setCanRegister] = useState(false);
  const [registryItems, setRegistryItems] = useState<{ [key: string]: { ref: string } }>({});
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  const [imagesLoadingResults, setImagesLoadingResults] = useState<ExecResult | null>(null);

  const loadCatalog = async (showNotification = true) => {
    const cachedCatalog = localStorage.getItem('catalog');
    try {
      const response = await fetch(CATALOG_URL);
      const catalog = await response.text();
      const items = parse(catalog)['registry'] as { [key: string]: CatalogItem }
      const itemsWithName = Object.entries(items).map(([name, item]) => ({ name, ...item }));
      setCatalogItems(itemsWithName);
      localStorage.setItem('catalog', JSON.stringify(itemsWithName));
      if (showNotification) {
        client.desktopUI.toast.success('Catalog updated successfully.');
      }
    }
    catch (error) {
      if (cachedCatalog) {
        setCatalogItems(JSON.parse(cachedCatalog));
      }
      if (showNotification) {
        client.desktopUI.toast.error(`Failed to get latest catalog.${cachedCatalog ? ' Using cached catalog.' : ''}` + error);
      }
    }
  }

  const loadRegistry = async () => {
    setRegistryLoaded(false);
    setCanRegister(false);
    try {
      const result = await getRegistry(client)
      setRegistryItems(result || {});
      setRegistryLoaded(true);

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

  const registerCatalogItem = async (item: CatalogItemWithName) => {
    try {
      const currentRegistry = await getRegistry(client);
      const newRegistry = { ...currentRegistry, [item.name]: { ref: item.ref } };
      const payload = JSON.stringify({
        files: [{
          path: 'registry.yaml',
          content: stringify({ registry: newRegistry })
        }]
      })
      await client.docker.cli.exec('run', ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
      client.desktopUI.toast.success('Prompt registered successfully. Restart Claude Desktop to apply.');
      await loadRegistry();
      setShowReloadModal(!localStorage.getItem(NEVER_SHOW_AGAIN_KEY));
    }
    catch (error) {
      client.desktopUI.toast.error('Failed to register prompt: ' + error);
    }
  }

  const unregisterCatalogItem = async (item: CatalogItemWithName) => {
    try {
      const currentRegistry = await getRegistry(client);
      delete currentRegistry[item.name];
      const payload = JSON.stringify({
        files: [{
          path: 'registry.yaml',
          content: stringify({ registry: currentRegistry })
        }]
      })
      await client.docker.cli.exec('run', ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
      client.desktopUI.toast.success('Prompt unregistered successfully. Restart Claude Desktop to apply.');
      await loadRegistry();
      setShowReloadModal(!localStorage.getItem(NEVER_SHOW_AGAIN_KEY));
    }
    catch (error) {
      client.desktopUI.toast.error('Failed to unregister prompt: ' + error)
    }

  }

  const startImagesLoading = async () => {
    setImagesLoadingResults(null);
    try {
      const result = await client.docker.cli.exec('pull', ['vonwig/function_write_files:latest'])
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
    loadCatalog();
    startImagesLoading();
    loadRegistry();
    const interval = setInterval(() => {
      loadCatalog(false);
      loadRegistry();
    }, 30000)
    return () => {
      clearInterval(interval)
    }
  }, []);

  const hasOutOfCatalog = catalogItems.length > 0 && Object.keys(registryItems).length > 0 && !Object.keys(registryItems).every((i) =>
    catalogItems.some((c) => c.name === i)
  )

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
      <Dialog open={showReloadModal} onClose={() => setShowReloadModal(false)}>

        <DialogTitle>Registry Updated</DialogTitle>
        <DialogContent>
          <Typography sx={{ marginBottom: 2 }}>
            You have updated the registry.
            Use the keybind {client.host.platform === 'win32' ? 'Ctrl' : '⌘'} + R to refresh MCP servers in Claude Desktop.
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <Button onClick={() => {
              setShowReloadModal(false)
            }}>Close</Button>
            <FormControlLabel control={<Checkbox defaultChecked={Boolean(localStorage.getItem(NEVER_SHOW_AGAIN_KEY))} onChange={(e) => localStorage.setItem(NEVER_SHOW_AGAIN_KEY, e.target.checked.toString())} />} label="Don't show this again" />
          </Stack>
        </DialogContent>
      </Dialog>

      <Stack direction="column" spacing={1}>
        <div>
          <ButtonGroup>
            <Button onClick={() => loadCatalog(true)}>Refresh catalog</Button>
            <Button onClick={loadRegistry}>Refresh registry</Button>
          </ButtonGroup>
          <RegistrySyncStatus registryLoaded={registryLoaded} />
          <ClaudeConfigSyncStatus client={client} setHasConfig={setHasConfig} />
          <Gordon client={client} />
        </div>
        {!hasConfig && Object.keys(registryItems).length > 0 && <Alert severity="warning">
          Claude Desktop has not been configured with docker_mcp.  Click on the Claude icon to update the configuration.
        </Alert>}
        {hasOutOfCatalog && <Alert action={<Button startIcon={<FolderOpenRounded />} variant='outlined' color='secondary' onClick={() => {
          client.desktopUI.navigate.viewVolume('docker-prompts')
        }}>registry.yaml</Button>} severity="info">
          <Typography sx={{ width: '100%' }}>You have some prompts registered which are not available in the catalog.</Typography>
        </Alert>}
        <Grid container spacing={2}>
          {catalogItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.name} flex="1 1 0">
              <CatalogItemCard openUrl={() => {
                client.host.openExternal(Ref.fromRef(item.ref).toURL(true))
              }}
                item={item}
                canRegister={canRegister}
                registered={Object.keys(registryItems).some((i) => i === item.name)}
                register={registerCatalogItem}
                unregister={unregisterCatalogItem}
              />

            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} flex="1 1 0">
            <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent>
                <IconButton sx={{ height: '100%' }} onClick={() => {
                  client.host.openExternal('https://vonwig.github.io/prompts.docs/tools/docs/')
                }}>
                  <AddIcon sx={{ width: '100%', height: 100 }} />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </div>
  )

}