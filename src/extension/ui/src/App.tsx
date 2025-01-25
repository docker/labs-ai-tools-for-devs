import React, { useEffect, useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Paper, Stack, Typography, Button, ButtonGroup, Grid, Dialog, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { run } from 'node:test';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';
import { CatalogItem, CatalogItemCard, CatalogItemWithName } from './components/PromptCard';
import { parse, stringify } from 'yaml';
import { Ref } from './Refs';
import { ClaudeConfigStatus } from './components/ClaudeConfigStatus';

type RegistryItem = {
  ref: string;
}

const client = createDockerDesktopClient();

const READ_REGISTRY_COMMAND_ARGS = ['--rm', '-v', 'docker-prompts:/docker-prompts', 'alpine:latest', 'sh', '-c', '"cat /docker-prompts/registry.yaml"']

const getRegistry = async () => {
  const catFile = async () => {
    const result = await client.docker.cli.exec('run', READ_REGISTRY_COMMAND_ARGS)
    return parse(result.stdout)['registry'] as Promise<{ [key: string]: { ref: string } }>;
  }
  try {
    return await catFile()
  }
  catch (error) {
    if (typeof error === 'object' && error && 'stderr' in error && error.stderr && (error.stderr as string).includes('No such file or directory')) {
      const payload = JSON.stringify({
        files: [{
          path: 'registry.yaml',
          content: 'registry: {}'
        }]
      })
      await client.docker.cli.exec('run', ['--rm', '--workdir', '/docker-prompts', '-v', 'docker-prompts:/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
      return await catFile();
    }
    client.desktopUI.toast.error('Failed to get prompt registry: ' + error)
    return {};
  }
}

const CATALOG_URL = 'https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml'

export function App() {

  const [claudeModal, setClaudeModal] = useState({ show: false, content: '' });
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
    setCanRegister(false);
    setStatus({ status: 'loading', message: 'Grabbing prompt registry...' });
    try {
      const result = await getRegistry()
      setRegistryItems(result);
      setStatus({ status: 'idle', message: '' });
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
      const currentRegistry = await getRegistry();
      const newRegistry = { ...currentRegistry, [item.name]: { ref: item.ref } };
      const payload = JSON.stringify({
        files: [{
          path: 'registry.yaml',
          content: stringify({ registry: newRegistry })
        }]
      })
      await client.docker.cli.exec('run', ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
      client.desktopUI.toast.success('Prompt registered successfully');
      loadRegistry();
    }
    catch (error) {
      client.desktopUI.toast.error('Failed to register prompt: ' + error);
    }
  }

  const unregisterCatalogItem = async (item: CatalogItemWithName) => {
    try {
      const currentRegistry = await getRegistry();
      delete currentRegistry[item.name];
      const payload = JSON.stringify({
        files: [{
          path: 'registry.yaml',
          content: stringify({ registry: currentRegistry })
        }]
      })
      await client.docker.cli.exec('run', ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
      client.desktopUI.toast.success('Prompt unregistered successfully');
      loadRegistry();
    }
    catch (error) {
      client.desktopUI.toast.error('Failed to unregister prompt: ' + error)
    }
  }

  const showClaudeDesktopConfig = async () => {
    const platform = client.host.platform
    let path = ''
    switch (platform) {
      case 'darwin':
        path = '/Users/$USER/Library/Application Support/Claude/claude_desktop_config.json'
        break;
      case 'linux':
        path = '/home/$USER/.config/claude/claude_desktop_config.json'
        break;
      case 'win32':
        path = '%APPDATA%\\Claude\\claude_desktop_config.json'
        break;
      default:
        client.desktopUI.toast.error('Unsupported platform: ' + platform)
        return;
    }
    const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/config.json`, 'alpine:latest', 'sh', '-c', `"cat /config.json"`])
    setClaudeModal({ show: true, content: result.stdout })
  }

  useEffect(() => {
    loadCatalog();
    loadRegistry();
  }, []);

  return (
    <div>
      <Dialog open={claudeModal.show} onClose={() => setClaudeModal({ show: false, content: '' })} maxWidth="lg">
        <DialogTitle>Current Claude Desktop Config</DialogTitle>
        <DialogContent>
          <DialogContentText component='pre'>
            <Typography >{claudeModal.content}</Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Stack direction="column" spacing={1}>
        <div>
          {status.status === 'loading' && <Typography>{status.message}</Typography>}
          {status.status === 'error' && <Typography>{status.message}</Typography>}
          <ButtonGroup>
            <Button onClick={loadCatalog}>Refresh catalog</Button>
            <Button onClick={loadRegistry}>Refresh registry</Button>
            <Button onClick={showClaudeDesktopConfig}>Show Claude Desktop Config</Button>
          </ButtonGroup>
          <ClaudeConfigStatus client={client} />
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
        </Grid>
      </Stack>
    </div>
  )
}