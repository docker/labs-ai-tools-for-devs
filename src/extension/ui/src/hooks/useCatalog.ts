import { v1 } from "@docker/extension-api-client-types";
import { CatalogItemWithName } from '../types/catalog';
import { getRegistry } from '../Registry';
import Secrets from '../Secrets';
import { parse } from 'yaml';
import { CATALOG_URL, POLL_INTERVAL, UNASSIGNED_SECRET_PLACEHOLDER } from '../Constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplateForItem } from './useConfig';
import { Secret } from '../types/secrets';
import { useState } from 'react';
import { escapeJSONForPlatformShell, tryRunImageSync } from '../FileWatcher';
import { stringify } from 'yaml';
import { useConfig } from './useConfig';
import { useRequiredImages } from './useRequiredImages';

// Storage keys for each query type
const STORAGE_KEYS = {
    secrets: 'docker-catalog-secrets',
    catalog: 'docker-catalog-catalog',
    registry: 'docker-catalog-registry',
};

export function useSecrets(client: v1.DockerDesktopClient) {
    const queryClient = useQueryClient();

    const {
        data: secrets = [],
        refetch: refetchSecrets,
        isLoading: secretsLoading
    } = useQuery({
        queryKey: ['secrets'],
        queryFn: async () => {
            try {
                const response = await Secrets.getSecrets(client);
                return response || [];
            } catch (error) {
                if (error instanceof Error) {
                    client.desktopUI.toast.error('Failed to get secrets: ' + error.message);
                } else {
                    client.desktopUI.toast.error('Failed to get secrets: ' + JSON.stringify(error));
                }
                throw error;
            }
        },
        refetchInterval: POLL_INTERVAL,
        staleTime: 30000,
        gcTime: 300000
    });

    // Load initial secrets from localStorage on mount
    useQuery({
        queryKey: ['secrets', 'init'],
        queryFn: async () => {
            const cachedSecrets = localStorage.getItem(STORAGE_KEYS.secrets);
            if (cachedSecrets && queryClient && !secrets.length) {
                try {
                    const parsedSecrets = JSON.parse(cachedSecrets);
                    queryClient.setQueryData(['secrets'], parsedSecrets);
                } catch (e) {
                    console.error('Failed to parse cached secrets:', e);
                }
            }
            return null;
        },
        staleTime: Infinity,
        gcTime: 0
    });

    // Persist secrets to localStorage when they change
    useQuery({
        queryKey: ['secrets', 'persist', secrets],
        queryFn: async () => {
            if (secrets && secrets.length > 0) {
                localStorage.setItem(STORAGE_KEYS.secrets, JSON.stringify(secrets));
            }
            return null;
        },
        staleTime: Infinity,
        gcTime: 0
    });

    const updateSecretsMutation = useMutation({
        mutationFn: async (secret: { name: string, value: string }) => {
            try {
                if (secret.value === UNASSIGNED_SECRET_PLACEHOLDER) {
                    await Secrets.deleteSecret(client, secret.name);
                } else {
                    await Secrets.addSecret(client, { name: secret.name, value: secret.value, policies: [] });
                }
            }
            catch (error) {
                client.desktopUI.toast.error('Failed to update secret: ' + error);
                throw error;
            }
        },
        onSuccess: () => {
            refetchSecrets();
        },
        onError: (error) => {
            client.desktopUI.toast.error('Failed to update secret: ' + error);
            throw error;
        }
    });

    return {
        secrets,
        secretsLoading,
        tryLoadSecrets: refetchSecrets,
        tryUpdateSecrets: (secret: { name: string, value: string }) => updateSecretsMutation.mutateAsync(secret)
    };
}

// Type for query context with custom meta data
interface QueryContextWithMeta {
    meta?: {
        showNotification?: boolean;
    };
}

export function useCatalog(client: v1.DockerDesktopClient) {
    const queryClient = useQueryClient();

    const {
        data: catalogItems = [],
        isLoading: catalogLoading,
        refetch: refetchCatalog
    } = useQuery({
        queryKey: ['catalog'],
        queryFn: async (context) => {
            const queryContext = context as unknown as QueryContextWithMeta;
            const showNotification = queryContext.meta?.showNotification ?? false;
            try {
                const response = await fetch(CATALOG_URL);
                const catalog = await response.text();
                const items = parse(catalog)['registry'] as { [key: string]: any };
                const itemsWithName = Object.entries(items).map(([name, item]) => ({ name, ...item }));
                if (showNotification) {
                    client.desktopUI.toast.success('Catalog updated successfully.');
                }
                return itemsWithName.reverse() as CatalogItemWithName[];
            } catch (error) {
                client.desktopUI.toast.error('Failed to get latest catalog.' + error);
                throw error;
            }
        },
        refetchInterval: POLL_INTERVAL,
        staleTime: 60000,
        gcTime: 300000
    });

    // Load initial catalog from localStorage on mount
    useQuery({
        queryKey: ['catalog', 'init'],
        queryFn: async () => {
            const cachedCatalog = localStorage.getItem(STORAGE_KEYS.catalog);
            if (cachedCatalog && queryClient && !catalogItems.length) {
                try {
                    const parsedCatalog = JSON.parse(cachedCatalog) as CatalogItemWithName[];
                    queryClient.setQueryData(['catalog'], parsedCatalog);
                } catch (e) {
                    console.error('Failed to parse cached catalog:', e);
                }
            }
            return null;
        },
        staleTime: Infinity,
        gcTime: 0
    });

    // Persist catalog to localStorage when it changes
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

    const tryLoadCatalog = async (showNotification = true) => {
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
        tryLoadCatalog
    };
}

export function useRegistry(client: v1.DockerDesktopClient) {
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

    return {
        registryItems,
        registryLoading,
        canRegister,
        tryLoadRegistry: refetchRegistry
    };
}

export function useCatalogOperations(client: v1.DockerDesktopClient) {
    const queryClient = useQueryClient();
    const { registryItems, canRegister } = useRegistry(client);
    const { config, syncConfigWithRegistry } = useConfig(client);
    const { loadAllImages } = useRequiredImages(client);

    // Register catalog item mutation
    const registerItemMutation = useMutation({
        mutationFn: async ({ item, showNotification }: { item: CatalogItemWithName, showNotification: boolean }) => {
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
                        const configSchema = item.config[0];

                        // Check if we have required fields from anyOf conditions
                        if (configSchema.anyOf) {
                            configSchema.anyOf.forEach((condition: any) => {
                                if (condition.required) {
                                    condition.required.forEach((field: string) => {
                                        if (!(field in itemConfig)) {
                                            // Generate a default value if possible
                                            itemConfig[field] = "";
                                        }
                                    });
                                }
                            });
                        }

                        // Handle normal required fields
                        if (configSchema.required) {
                            configSchema.required.forEach((field: string) => {
                                if (!(field in itemConfig)) {
                                    // Generate a default value if possible
                                    itemConfig[field] = "";
                                }
                            });
                        }

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

                await syncConfigWithRegistry(newRegistry);
                await loadAllImages();

                if (showNotification) {
                    client.desktopUI.toast.success(`${item.name} registered successfully.`);
                }
                return { success: true, newRegistry };
            } catch (error) {
                client.desktopUI.toast.error('Failed to register catalog item: ' + error);
                throw error;
            }
        },
        onSuccess: async (data) => {
            // Update the registry data after successful registration
            queryClient.setQueryData(['registry'], data.newRegistry);
        }
    });

    // Unregister catalog item mutation
    const unregisterItemMutation = useMutation({
        mutationFn: async (item: CatalogItemWithName) => {
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

                // Explicitly sync the registry with config
                await syncConfigWithRegistry(currentRegistry);
                client.desktopUI.toast.success(`${item.name} unregistered successfully.`);
                return { success: true, newRegistry: currentRegistry };
            } catch (error) {
                client.desktopUI.toast.error('Failed to unregister catalog item: ' + error);
                throw error;
            }
        },
        onSuccess: async (data) => {
            // Update the registry data after successful unregistration
            queryClient.setQueryData(['registry'], data.newRegistry);
        }
    });

    // Start pull operation
    const startPullMutation = useMutation({
        mutationFn: async () => {
            queryClient.invalidateQueries({ queryKey: ['catalog'] });
            queryClient.invalidateQueries({ queryKey: ['registry'] });
            queryClient.invalidateQueries({ queryKey: ['secrets'] });
            queryClient.invalidateQueries({ queryKey: ['config'] });
            // Wait for all queries to revalidate
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ['catalog'] }),
                queryClient.refetchQueries({ queryKey: ['registry'] }),
                queryClient.refetchQueries({ queryKey: ['secrets'] }),
                queryClient.refetchQueries({ queryKey: ['config'] })
            ]);
            return { success: true };
        }
    });

    const getCanRegisterCatalogItem = (item: CatalogItemWithName): boolean => {
        if (!registryItems) return false;
        const isRegistered = !!registryItems[item.name];
        return !isRegistered && canRegister;
    };

    return {
        registerCatalogItem: (item: CatalogItemWithName, showNotification = true) =>
            registerItemMutation.mutateAsync({ item, showNotification }),
        unregisterCatalogItem: (item: CatalogItemWithName) =>
            unregisterItemMutation.mutateAsync(item),
        startPull: () => startPullMutation.mutateAsync(),
        getCanRegisterCatalogItem
    };
}

export function useCatalogAll(client: v1.DockerDesktopClient) {
    const { secrets, secretsLoading, tryLoadSecrets, tryUpdateSecrets } = useSecrets(client);
    const { catalogItems, catalogLoading, tryLoadCatalog } = useCatalog(client);
    const { registryItems, registryLoading, canRegister, tryLoadRegistry } = useRegistry(client);
    const {
        registerCatalogItem,
        unregisterCatalogItem,
        startPull,
        getCanRegisterCatalogItem
    } = useCatalogOperations(client);

    return {
        // State
        secrets,
        catalogItems,
        registryItems,
        canRegister,
        secretsLoading,
        catalogLoading,
        registryLoading,

        // Actions
        tryLoadSecrets,
        tryLoadCatalog,
        tryLoadRegistry,
        registerCatalogItem,
        unregisterCatalogItem,
        startPull,
        tryUpdateSecrets,
        getCanRegisterCatalogItem
    };
} 