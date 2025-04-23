import { v1 } from "@docker/extension-api-client-types";
import { CatalogItem, CatalogItemRichened, CatalogItemWithName } from '../types/catalog';
import { getRegistry } from '../Registry';
import Secrets from '../Secrets';
import { parse } from 'yaml';
import { CATALOG_URL, POLL_INTERVAL, UNASSIGNED_SECRET_PLACEHOLDER } from '../Constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplateForItem } from './useConfig';
import { useState, useEffect } from 'react';
import { escapeJSONForPlatformShell, tryRunImageSync } from '../FileUtils';
import { useConfig } from './useConfig';
import { useSecrets } from "./useSecrets";

// Storage keys for each query type
const STORAGE_KEYS = {
    catalog: 'docker-catalog-catalog',
    registry: 'docker-catalog-registry',
};

// Type for query context with custom meta data
interface QueryContextWithMeta {
    meta?: {
        showNotification?: boolean;
    };
}

function useCatalog(client: v1.DockerDesktopClient) {
    const queryClient = useQueryClient();
    const { data: secrets, isLoading: secretsLoading } = useSecrets(client);
    const { registryItems, registryLoading } = useRegistry(client);
    const { config, configLoading: configLoading } = useConfig(client);

    const enrichCatalogItem = (item: CatalogItemWithName): CatalogItemRichened => {
        const secretsWithAssignment = Secrets.getSecretsWithAssignment(item, secrets || []);
        const itemConfigValue = config?.[item.name] || {};
        const neverOnceConfigured = Boolean(item.config && Object.keys(itemConfigValue).length === 0);
        const configTemplate = getTemplateForItem(item, itemConfigValue);
        const baseConfigTemplate = getTemplateForItem(item, {});
        const unConfigured = Boolean(item.config) && (neverOnceConfigured || JSON.stringify(itemConfigValue) === JSON.stringify(baseConfigTemplate));

        const missingASecret = secretsWithAssignment.some((secret) => !secret.assigned);
        const enrichedItem: CatalogItemRichened = {
            ...item,
            secrets: secretsWithAssignment,
            configValue: itemConfigValue,
            configSchema: item.config,
            configTemplate,
            missingConfig: unConfigured,
            missingSecrets: missingASecret,
            registered: !!registryItems?.[item.name],
            canRegister: !missingASecret && !unConfigured,
            name: item.name,
        };
        return enrichedItem;
    };

    const {
        data: catalogItems = [],
        isLoading: catalogLoading,
        refetch: refetchCatalog
    } = useQuery({
        queryKey: ['catalog'],
        enabled: !secretsLoading && !registryLoading && !configLoading,
        queryFn: async () => {
            const response = await fetch(CATALOG_URL);
            const catalog = await response.text();
            const items = parse(catalog)['registry'] as { [key: string]: any };
            const enrichedItems = Object.entries(items).map(([name, item]) => ({ name, ...item })) as CatalogItemWithName[];
            return enrichedItems.reverse().map(enrichCatalogItem);
        },
        refetchInterval: POLL_INTERVAL,
        staleTime: 60000,
        gcTime: 300000
    });

    // This effect will re-enrich catalog items whenever secrets, config, or registry items change
    // without causing a full catalog reload
    useEffect(() => {
        if (catalogItems.length > 0 && !secretsLoading && !configLoading && !registryLoading) {
            const enrichedItems = catalogItems.map(enrichCatalogItem);

            // Use the same reference if nothing changed to prevent unnecessary re-renders
            const hasChanges = JSON.stringify(enrichedItems) !== JSON.stringify(catalogItems);
            if (hasChanges) {
                queryClient.setQueryData(['catalog'], enrichedItems);
            }
        }
    }, [secrets, config, registryItems]);

    // Persist catalog to localStorage when it changes (for fallback only)
    useQuery({
        queryKey: ['catalog', 'persist', catalogItems],
        queryFn: async () => {
            if (catalogItems && catalogItems.length > 0) {
                localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(catalogItems));
            }
            return null;
        },
        staleTime: Infinity,
        gcTime: 0
    });

    const tryLoadCatalog = async () => {
        return await refetchCatalog({
            // Using the type cast for compatibility with the function signature
            // This is a workaround for the React Query v5 typing limitations
            throwOnError: false,
            cancelRefetch: false
        });
    };

    return {
        catalogItems,
        catalogLoading,
        tryLoadCatalog,
        refetchCatalog
    };
}

function useRegistry(client: v1.DockerDesktopClient) {
    const queryClient = useQueryClient();
    const [canRegister, setCanRegister] = useState<boolean>(false);

    const {
        data: registryItems = undefined,
        refetch: refetchRegistry,
        isLoading: registryLoading
    } = useQuery({
        queryKey: ['registry'],
        queryFn: async () => {
            setCanRegister(false);
            try {
                const result = await getRegistry(client);
                setCanRegister(true);
                return result || {};
            } catch (error) {
                if (error instanceof Error) {
                    client.desktopUI.toast.error('Failed to get prompt registry: ' + error.message);
                } else {
                    client.desktopUI.toast.error('Failed to get prompt registry: ' + JSON.stringify(error));
                }
                setCanRegister(true);
                throw error;
            }
        },
        refetchInterval: POLL_INTERVAL,
        staleTime: 30000,
        gcTime: 300000
    });

    // Load initial registry from localStorage on mount
    useQuery({
        queryKey: ['registry', 'init'],
        queryFn: async () => {
            const cachedRegistry = localStorage.getItem(STORAGE_KEYS.registry);
            if (cachedRegistry && queryClient && !registryItems) {
                try {
                    const parsedRegistry = JSON.parse(cachedRegistry);
                    queryClient.setQueryData(['registry'], parsedRegistry);
                } catch (e) {
                    console.error('Failed to parse cached registry:', e);
                }
            }
            return null;
        },
        staleTime: Infinity,
        gcTime: 0
    });

    // Persist registry to localStorage when it changes
    useQuery({
        queryKey: ['registry', 'persist', registryItems],
        queryFn: async () => {
            if (registryItems) {
                localStorage.setItem(STORAGE_KEYS.registry, JSON.stringify(registryItems));
            }
            return null;
        },
        staleTime: Infinity,
        gcTime: 0
    });

    const mutateRegistry = useMutation({
        mutationFn: async (newRegistry: { [key: string]: { ref: string; config?: any } }) => {
            const payload = escapeJSONForPlatformShell(
                { registry: newRegistry },
                client.host.platform
            );

            await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', 'registry.yaml', payload]);

            return newRegistry;
        }
    });

    return {
        registryItems,
        registryLoading,
        canRegister,
        tryLoadRegistry: refetchRegistry,
        mutateRegistry
    };
}

export function useCatalogOperations(client: v1.DockerDesktopClient) {
    const queryClient = useQueryClient();
    const { registryItems } = useRegistry(client);
    const { config } = useConfig(client);

    // Register catalog item mutation
    const registerItemMutation = useMutation({
        mutationFn: async ({ item, showNotification }: { item: CatalogItemRichened, showNotification: boolean }) => {
            try {
                const currentRegistry = registryItems || {};
                // Type the new registry appropriately
                const newRegistry: { [key: string]: { ref: string; config?: any } } = {
                    ...currentRegistry,
                    [item.name]: { ref: item.ref }
                };

                // Handle configuration
                if (item.config) {
                    let itemConfig = config?.[item.name] || {};

                    // If there's a JSON schema configuration, validate and generate default values
                    if (Array.isArray(item.config) && item.config.length > 0) {
                        // Use JSON schema template for any remaining defaults
                        const template = getTemplateForItem(item, itemConfig);
                        itemConfig = { ...template, ...itemConfig };
                    }

                    // Assign the configuration
                    newRegistry[item.name].config = itemConfig;
                }

                const payload = escapeJSONForPlatformShell(
                    { registry: newRegistry },
                    client.host.platform
                );

                await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', 'registry.yaml', payload]);

                if (showNotification) {
                    client.desktopUI.toast.success(`${item.name} registered successfully.`);
                }
                return { success: true, newRegistry };
            } catch (error) {
                client.desktopUI.toast.error('Failed to register catalog item: ' + error);
                // Treat YAML file write failures as fatal, no rollback
                throw error;
            }
        },
        onMutate: async ({ item }) => {
            // Optimistically update the registry data
            const currentRegistry = queryClient.getQueryData(['registry']) as { [key: string]: { ref: string; config?: any } } || {};
            const newRegistry: { [key: string]: { ref: string; config?: any } } = {
                ...currentRegistry,
                [item.name]: { ref: item.ref }
            };

            // If there's config, add it
            if (item.config && config && config[item.name]) {
                newRegistry[item.name] = {
                    ...newRegistry[item.name],
                    config: config[item.name]
                };
            }

            queryClient.setQueryData(['registry'], newRegistry);
        },
        onSuccess: async (data) => {
            // Update the registry data after successful registration
            queryClient.setQueryData(['registry'], data.newRegistry);
        }
    });

    // Unregister catalog item mutation
    const unregisterItemMutation = useMutation({
        mutationFn: async (item: CatalogItemRichened) => {
            try {
                // Get current registry
                const currentRegistry = { ...(registryItems || {}) };

                // Remove the item
                if (currentRegistry[item.name]) {
                    delete currentRegistry[item.name];
                }

                const payload = escapeJSONForPlatformShell(
                    { registry: currentRegistry },
                    client.host.platform
                );

                await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', 'registry.yaml', payload]);

                client.desktopUI.toast.success(`${item.name} unregistered successfully.`);
                return { success: true, newRegistry: currentRegistry };
            } catch (error) {
                client.desktopUI.toast.error('Failed to unregister catalog item: ' + error);
                // Treat YAML file write failures as fatal, no rollback
                throw error;
            }
        },
        onMutate: async (item) => {
            // Optimistically update the registry data
            const currentRegistry = { ...(queryClient.getQueryData(['registry']) as { [key: string]: { ref: string; config?: any } } || {}) };

            // Remove the item
            if (currentRegistry[item.name]) {
                delete currentRegistry[item.name];
            }

            queryClient.setQueryData(['registry'], currentRegistry);
        },
        onSuccess: async (data) => {
            // Update the registry data after successful unregistration
            queryClient.setQueryData(['registry'], data.newRegistry);
        }
    });

    return {
        registerCatalogItem: (item: CatalogItemRichened, showNotification = true) =>
            registerItemMutation.mutateAsync({ item, showNotification }),
        unregisterCatalogItem: (item: CatalogItemRichened) =>
            unregisterItemMutation.mutateAsync(item),
    };
}

export function useCatalogAll(client: v1.DockerDesktopClient) {
    const { catalogItems, catalogLoading, tryLoadCatalog } = useCatalog(client);
    const { registryItems, registryLoading, canRegister, tryLoadRegistry } = useRegistry(client);
    const {
        registerCatalogItem,
        unregisterCatalogItem,
    } = useCatalogOperations(client);

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
    };
} 