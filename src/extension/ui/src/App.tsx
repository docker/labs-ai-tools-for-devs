import React, { useState, Suspense } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Typography, Button, IconButton, Alert, DialogTitle, Dialog, DialogContent, CircularProgress, Paper, Box, SvgIcon, useTheme } from '@mui/material';
import { CatalogItemRichened } from './types/catalog';
import { Close } from '@mui/icons-material';
import { CatalogGrid } from './components/CatalogGrid';
import { POLL_INTERVAL } from './Constants';
import ConfigurationModal from './components/tile/Modal';
import LoadingState from './components/LoadingState';
import { useCatalogAll } from './hooks/useCatalog';
import { useRequiredImages } from './hooks/useRequiredImages';
import { useMCPClient } from './hooks/useMCPClient';
import { useConfig } from './hooks/useConfig';
import { useSecrets } from './hooks/useSecrets';

export const client = createDockerDesktopClient();

const DEFAULT_SETTINGS = {
  showModal: false,
  pollIntervalSeconds: POLL_INTERVAL / 1000
}

export function App() {
  const [settings, setSettings] = useState<{ showModal: boolean, pollIntervalSeconds: number }>(localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings') || '{}') : DEFAULT_SETTINGS);
  const [configuringItem, setConfiguringItem] = useState<CatalogItemRichened | null>(null);

  // Use hooks directly in the component
  const catalogAll = useCatalogAll(client);
  const requiredImages = useRequiredImages(client);
  const mcpClient = useMCPClient(client);
  const config = useConfig(client);
  const secrets = useSecrets(client);

  // Create a context-like combined props object to pass to children
  const appProps = {
    // Catalog related props
    ...catalogAll,

    // Required images props
    ...requiredImages,

    // MCP Client props
    ...mcpClient,

    // Config props
    ...config
  };

  const isLoading = catalogAll.catalogLoading ||
    catalogAll.registryLoading ||
    requiredImages.isLoading ||
    secrets.isLoading;

  return (
    <>
      {isLoading ? (
        <LoadingState appProps={appProps} />
      ) : (
        <CatalogGrid
          appProps={appProps}
        />
      )}
    </>
  );
}