import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useEffect } from 'react';

import { CatalogGrid } from './components/CatalogGrid';
import LoadingState from './components/LoadingState';
import { useCatalogAll } from './queries/useCatalog';
import { useConfig } from './queries/useConfig';
import { useMCPClient } from './queries/useMCPClient';
import { useRequiredImages } from './queries/useRequiredImages';
import { useSecrets } from './queries/useSecrets';
import { syncRegistryWithConfig } from './Registry';

export const client = createDockerDesktopClient();

export function App() {
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
    ...config,
  };

  const isLoading =
    catalogAll.catalogLoading ||
    catalogAll.registryLoading ||
    requiredImages.isLoading ||
    secrets.isLoading;

  useEffect(() => {
    if (config.config && catalogAll.registryItems) {
      syncRegistryWithConfig(client, catalogAll.registryItems, config.config);
    }
  }, [config.config]);

  return (
    <>
      {isLoading ? (
        <LoadingState appProps={appProps} />
      ) : (
        <CatalogGrid appProps={appProps} />
      )}
    </>
  );
}
