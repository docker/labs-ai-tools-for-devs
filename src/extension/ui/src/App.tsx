import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Stack, Typography, Button, ButtonGroup, Grid, debounce, Card, CardContent, IconButton } from '@mui/material';
import { CatalogItem, CatalogItemCard, CatalogItemWithName } from './components/PromptCard';
import { parse, stringify } from 'yaml';
import { Ref } from './Refs';
import { RegistrySyncStatus } from './components/RegistrySyncStatus';
import { getRegistry } from './Registry';
import { ClaudeConfigSyncStatus } from './components/ClaudeConfigSyncStatus';

type RegistryItem = {
  ref: string;
}

const client = createDockerDesktopClient();

const CATALOG_URL = 'https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml'

export function App() {

  const [registryLoaded, setRegistryLoaded] = useState(false);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [canRegister, setCanRegister] = useState(false);
  const [registryItems, setRegistryItems] = useState<{ [key: string]: { ref: string } }>({});
  const [status, setStatus] = useState<{
    status: 'idle' | 'loading' | 'error',
    message: string
  }>({
    status: 'idle',
    message: ''
  });

  const loadCatalog = async () => {
    setStatus({ status: 'loading', message: 'Grabbing latest prompt catalog...' });
    try {
      const response = await fetch(CATALOG_URL);
      const catalog = await response.text();
      setItems(parse(catalog)['registry']);
      setStatus({ status: 'idle', message: '' });
    }
    catch (error) {
      client.desktopUI.toast.error('Failed to get latest catalog: ' + error);
    }
  }

  const loadRegistry = async () => {
    setRegistryLoaded(false);
    setCanRegister(false);
    setStatus({ status: 'loading', message: 'Grabbing prompt registry...' });
    try {
      const result = await getRegistry(client)
      setRegistryItems(result);
      setStatus({ status: 'idle', message: '' });
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
      client.desktopUI.toast.success('Prompt registered successfully');
      await loadRegistry();
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
      client.desktopUI.toast.success('Prompt unregistered successfully');
      await loadRegistry();
    }
    catch (error) {
      client.desktopUI.toast.error('Failed to unregister prompt: ' + error)
    }
  }

  useEffect(() => {
    loadCatalog();
    loadRegistry();
    const interval = setInterval(() => {
      loadCatalog();
      loadRegistry();
    }, 30000)
    return () => {
      clearInterval(interval)
    }
  }, []);



  return (
    <div>
      <Stack direction="column" spacing={1}>
        <div>
          <ButtonGroup>
            <Button onClick={loadCatalog}>Refresh catalog</Button>
            <Button onClick={loadRegistry}>Refresh registry</Button>
          </ButtonGroup>
          <RegistrySyncStatus registryLoaded={registryLoaded} />
          <ClaudeConfigSyncStatus client={client} />
        </div>
        <Grid container spacing={2}>
          {Object.entries(items).map(([name, item]) => (
            <Grid item xs={12} sm={6} md={4} key={name} flex="1 1 0">
              <CatalogItemCard openUrl={() => {
                client.host.openExternal(Ref.fromRef(item.ref).toURL(true))
              }}
                item={{ name, ...item }}
                canRegister={canRegister}
                registered={Object.keys(registryItems).some((i) => i === name)}
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