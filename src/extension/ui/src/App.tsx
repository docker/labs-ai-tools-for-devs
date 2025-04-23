import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useEffect, useCallback, memo } from 'react';

import { CatalogGrid } from './components/CatalogGrid';
import LoadingState from './components/LoadingState';
import { useCatalogAll } from './queries/useCatalog';
import { useConfig } from './queries/useConfig';
import { useMCPClient } from './queries/useMCPClient';
import { useRequiredImages } from './queries/useRequiredImages';
import { useSecrets } from './queries/useSecrets';
import { syncRegistryWithConfig } from './Registry';

export const client = createDockerDesktopClient();

// Memoize the CatalogGrid component to prevent unnecessary re-renders
const MemoizedCatalogGrid = memo(CatalogGrid);
const MemoizedLoadingState = memo(LoadingState);

export function App() {
  // Use hooks directly in the component
  const catalogAll = useCatalogAll(client);
  const requiredImages = useRequiredImages(client);
  const mcpClient = useMCPClient(client);
  const config = useConfig(client);
  const secrets = useSecrets(client);

  // Create a memoized callback for syncing registry with config
  const syncRegistry = useCallback(async () => {
    if (config.config && catalogAll.registryItems) {
      await syncRegistryWithConfig(client, catalogAll.registryItems, config.config);
    }
  }, [config.config, catalogAll.registryItems]);

  // Create a context-like combined props object to pass to children
  const appProps = {
    // Catalog related props
    ...catalogAll,

    // Required images props
    ...requiredImages,

    // MCP Client props
    ...mcpClient,

    // Config props
    ...config,
  };

  const isLoading =
    catalogAll.catalogLoading ||
    catalogAll.registryLoading ||
    requiredImages.isLoading ||
    secrets.isLoading;

  useEffect(() => {
    syncRegistry();
  }, [syncRegistry]);

  return (
    <>
      {isLoading ? (
        <MemoizedLoadingState appProps={appProps} />
      ) : (
        <MemoizedCatalogGrid appProps={appProps} />
      )}
    </>
  );
}
