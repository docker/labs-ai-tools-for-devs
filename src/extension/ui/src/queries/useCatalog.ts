import { v1 } from "@docker/extension-api-client-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { parse, stringify } from "yaml";
import { CATALOG_URL, REGISTRY_YAML } from "../Constants";
import { writeToPromptsVolume } from "../utils/Files";
import { getRegistry, syncRegistryWithConfig } from "../Registry";
import Secrets from "../Secrets";
import { CatalogItemRichened, CatalogItemWithName } from "../types/catalog";
import { getTemplateForItem, useConfig } from "./useConfig";
import { useSecrets } from "./useSecrets";

const STORAGE_KEYS = {
  catalog: "docker-catalog-catalog",
  registry: "docker-catalog-registry",
};

function useCatalog(client: v1.DockerDesktopClient) {
  const queryClient = useQueryClient();
  const { data: secrets, isLoading: secretsLoading } = useSecrets(client);
  const { registryItems, registryLoading } = useRegistry(client);
  const { config, configLoading: configLoading } = useConfig(client);

  const enrichCatalogItem = useCallback(
    (item: CatalogItemWithName): CatalogItemRichened => {
      const secretsWithAssignment = Secrets.getSecretsWithAssignment(
        item,
        secrets || []
      );
      const itemConfigValue = config?.[item.name] || {};
      const neverOnceConfigured = Boolean(
        item.config && Object.keys(itemConfigValue).length === 0
      );
      const configTemplate = getTemplateForItem(item, itemConfigValue);
      const baseConfigTemplate = getTemplateForItem(item, {});
      const unConfigured =
        Boolean(item.config) &&
        (neverOnceConfigured ||
          JSON.stringify(itemConfigValue) ===
            JSON.stringify(baseConfigTemplate));

      const missingASecret = secretsWithAssignment.some(
        (secret) => !secret.assigned
      );
      const enrichedItem: CatalogItemRichened = {
        ...item,
        secrets: secretsWithAssignment,
        configValue: itemConfigValue,
        configSchema: item.config || {},
        configTemplate,
        missingConfig: unConfigured,
        missingSecrets: missingASecret,
        registered: !!registryItems?.[item.name],
        canRegister: !missingASecret && !unConfigured,
        name: item.name,
      };
      return enrichedItem;
    },
    [secrets, config, registryItems]
  );

  const {
    data: catalogItems = [],
    isLoading: catalogLoading,
    refetch: refetchCatalog,
  } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const response = await fetch(
        localStorage.getItem("catalogUrl") || CATALOG_URL
      );
      const catalog = await response.text();
      const items = parse(catalog)["registry"] as { [key: string]: any };
      const enrichedItems = Object.entries(items).map(([name, item]) => ({
        name,
        ...item,
      })) as CatalogItemWithName[];
      return enrichedItems.reverse().map(enrichCatalogItem);
    },
  });

  // This effect will re-enrich catalog items whenever secrets, config, or registry items change
  // without causing a full catalog reload
  useEffect(() => {
    if (
      catalogItems.length > 0 &&
      !secretsLoading &&
      !configLoading &&
      !registryLoading
    ) {
      const enrichedItems = catalogItems.map(enrichCatalogItem);

      // Use deep comparison for determining if updates are needed
      if (JSON.stringify(enrichedItems) !== JSON.stringify(catalogItems)) {
        // Use a stable reference for query data updates
        queryClient.setQueryData(["catalog"], [...enrichedItems]);
      }
    }
  }, [
    catalogItems,
    enrichCatalogItem,
    secretsLoading,
    configLoading,
    registryLoading,
    queryClient,
  ]);

  // Persist catalog to localStorage when it changes (for fallback only)
  useQuery({
    queryKey: ["catalog", "persist", catalogItems],
    queryFn: async () => {
      if (catalogItems && catalogItems.length > 0) {
        localStorage.setItem(
          STORAGE_KEYS.catalog,
          JSON.stringify(catalogItems)
        );
      }
      return null;
    },
    staleTime: Infinity,
    gcTime: 0,
  });

  const tryLoadCatalog = async () => {
    return await refetchCatalog({
      cancelRefetch: false,
    });
  };

  return {
    catalogItems,
    catalogLoading,
    tryLoadCatalog,
    refetchCatalog,
  };
}

function useRegistry(client: v1.DockerDesktopClient) {
  const queryClient = useQueryClient();
  const [canRegister, setCanRegister] = useState<boolean>(false);
  const { config } = useConfig(client);

  const {
    data: registryItems = undefined,
    refetch: refetchRegistry,
    isLoading: registryLoading,
  } = useQuery({
    queryKey: ["registry"],
    networkMode: "always",
    queryFn: async () => {
      setCanRegister(false);
      try {
        const result = await getRegistry(client);
        setCanRegister(true);
        return result || {};
      } catch (error) {
        if (error instanceof Error) {
          client.desktopUI.toast.error(
            "Failed to get prompt registry: " + error.message
          );
        } else {
          client.desktopUI.toast.error(
            "Failed to get prompt registry: " + JSON.stringify(error)
          );
        }
        setCanRegister(true);
        throw error;
      }
    },
  });

  useQuery({
    queryKey: ["registry", "init"],
    queryFn: async () => {
      const cachedRegistry = localStorage.getItem(STORAGE_KEYS.registry);
      if (cachedRegistry && queryClient && !registryItems) {
        try {
          const parsedRegistry = JSON.parse(cachedRegistry);
          queryClient.setQueryData(["registry"], parsedRegistry);
        } catch (e) {
          console.error("Failed to parse cached registry:", e);
        }
      }
      return null;
    },
    staleTime: Infinity,
    gcTime: 0,
  });

  const registryItemsString = useMemo(
    () => (registryItems ? JSON.stringify(registryItems) : null),
    [registryItems]
  );

  useQuery({
    queryKey: ["registry", "persist"],
    queryFn: async () => {
      if (registryItemsString) {
        localStorage.setItem(STORAGE_KEYS.registry, registryItemsString);
      }
      return null;
    },
    enabled: !!registryItemsString,
    staleTime: Infinity,
    gcTime: 0,
  });

  const mutateRegistry = useMutation({
    mutationFn: async (newRegistry: {
      [key: string]: { ref: string; config?: any };
    }) => {
      await writeToPromptsVolume(
        client,
        REGISTRY_YAML,
        stringify({ registry: newRegistry })
      );

      return newRegistry;
    },
  });

  const syncRegistryWithConfigMutation = useMutation({
    mutationFn: async () => {
      if (!config || !registryItems) return { success: false };
      await syncRegistryWithConfig(client, registryItems, config);
    },
  });

  return {
    registryItems,
    registryLoading,
    canRegister,
    tryLoadRegistry: refetchRegistry,
    mutateRegistry,
    syncRegistryWithConfig: syncRegistryWithConfigMutation.mutateAsync,
  };
}

export function useCatalogOperations(client: v1.DockerDesktopClient) {
  const queryClient = useQueryClient();
  const { registryItems } = useRegistry(client);

  // Register catalog item mutation
  const registerItemMutation = useMutation({
    mutationFn: async ({ item }: { item: CatalogItemRichened }) => {
      try {
        const currentRegistry = registryItems || {};
        // Type the new registry appropriately
        const newRegistry: { [key: string]: { ref: string; config?: any } } = {
          ...currentRegistry,
          [item.name]: { ref: item.ref },
        };

        await writeToPromptsVolume(
          client,
          REGISTRY_YAML,
          stringify({ registry: newRegistry })
        );
        return { success: true, newRegistry };
      } catch (error) {
        client.desktopUI.toast.error(
          "Failed to register catalog item: " + error
        );
        // Treat YAML file write failures as fatal, no rollback
        throw error;
      }
    },
    // Only need one update of registry data, not both onMutate and onSuccess
    onSuccess: async (data) => {
      // Update the registry data after successful registration
      queryClient.setQueryData(["registry"], data.newRegistry);
    },
  });

  // Unregister catalog item mutation - similar changes
  const unregisterItemMutation = useMutation({
    mutationFn: async (item: CatalogItemRichened) => {
      try {
        // Get current registry
        const currentRegistry = { ...(registryItems || {}) };

        // Remove the item
        if (currentRegistry[item.name]) {
          delete currentRegistry[item.name];
        }

        await writeToPromptsVolume(
          client,
          REGISTRY_YAML,
          stringify({ registry: currentRegistry })
        );

        return { success: true, newRegistry: currentRegistry };
      } catch (error) {
        client.desktopUI.toast.error(
          "Failed to unregister catalog item: " + error
        );
        // Treat YAML file write failures as fatal, no rollback
        throw error;
      }
    },
    // Only need one update of registry data, not both onMutate and onSuccess
    onSuccess: async (data) => {
      // Update the registry data after successful unregistration
      queryClient.setQueryData(["registry"], data.newRegistry);
    },
  });

  return {
    registerCatalogItem: (item: CatalogItemRichened) =>
      registerItemMutation.mutateAsync({ item }),
    unregisterCatalogItem: (item: CatalogItemRichened) =>
      unregisterItemMutation.mutateAsync(item),
  };
}

// This hook represents the catalog query. The registry is not part of the UI and does not need to be exported.
export function useCatalogAll(client: v1.DockerDesktopClient) {
  const { catalogItems, catalogLoading, tryLoadCatalog } = useCatalog(client);
  const {
    registryItems,
    registryLoading,
    canRegister,
    tryLoadRegistry,
    syncRegistryWithConfig,
  } = useRegistry(client);
  const { registerCatalogItem, unregisterCatalogItem } =
    useCatalogOperations(client);

  return {
    // State
    catalogItems,
    registryItems,
    canRegister,
    catalogLoading,
    registryLoading,

    // Actions
    tryLoadCatalog,
    tryLoadRegistry,
    registerCatalogItem,
    unregisterCatalogItem,
    syncRegistryWithConfig,
  };
}
