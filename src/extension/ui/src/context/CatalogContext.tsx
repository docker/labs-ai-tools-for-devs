import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { v1 } from "@docker/extension-api-client-types";
import { CatalogItemWithName } from '../types/catalog';
import { getRegistry } from '../Registry';
import Secrets from '../Secrets';
import { parse } from 'yaml';
import { CATALOG_URL, POLL_INTERVAL, UNASSIGNED_SECRET_PLACEHOLDER } from '../Constants';
import { escapeJSONForPlatformShell, tryRunImageSync } from '../FileWatcher';
import { stringify } from 'yaml';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplateForItem, useConfigContext } from './ConfigContext';
import { useRequiredImagesContext } from './RequiredImageContext';
import { Secret } from '../types/secrets';
// Storage keys for each query type
const STORAGE_KEYS = {
    secrets: 'docker-catalog-secrets',
    catalog: 'docker-catalog-catalog',
    registry: 'docker-catalog-registry',
};

interface CatalogContextType {
    // State        
    secrets: Secret[];
    catalogItems: CatalogItemWithName[];
    registryItems: { [key: string]: { ref: string; config: any } } | undefined;
    canRegister: boolean;
    secretsLoading: boolean;
    catalogLoading: boolean;
    registryLoading: boolean;

    // Actions
    tryLoadSecrets: () => Promise<void>;
    tryLoadCatalog: (showNotification?: boolean) => Promise<void>;
    tryLoadRegistry: () => Promise<void>;
    registerCatalogItem: (item: CatalogItemWithName, showNotification?: boolean) => Promise<void>;
    unregisterCatalogItem: (item: CatalogItemWithName) => Promise<void>;
    startPull: () => Promise<void>;
    tryUpdateSecrets: (secret: { name: string, value: string }) => Promise<void>;
    getCanRegisterCatalogItem: (item: CatalogItemWithName) => boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function useCatalogContext() {
    const context = useContext(CatalogContext);
    if (context === undefined) {
        throw new Error('useCatalogContext must be used within a CatalogProvider');
    }
    return context;
}

interface CatalogProviderProps {
    children: ReactNode;
    client: v1.DockerDesktopClient;
}

export function CatalogProvider({ children, client }: CatalogProviderProps) {
    // State
    const [canRegister, setCanRegister] = useState<boolean>(false);
    const queryClient = useQueryClient();

    // Get config context
    const { config, tryLoadConfig, syncConfigWithRegistry: syncConfigWithRegistryFromContext } = useConfigContext();

    // Get the required images context
    const { loadAllImages } = useRequiredImagesContext();

    // Load secrets with React Query
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

    // Persist secrets to localStorage
    useEffect(() => {
        if (secrets && secrets.length > 0) {
            localStorage.setItem(STORAGE_KEYS.secrets, JSON.stringify(secrets));
        }
    }, [secrets]);

    // Load initial secrets from localStorage
    useEffect(() => {
        const cachedSecrets = localStorage.getItem(STORAGE_KEYS.secrets);
        if (cachedSecrets && queryClient && secrets.length === 0) {
            try {
                const parsedSecrets = JSON.parse(cachedSecrets);
                queryClient.setQueryData(['secrets'], parsedSecrets);
            } catch (e) {
                console.error('Failed to parse cached secrets:', e);
            }
        }
    }, [queryClient, secrets]);

    // Load catalog with React Query
    const {
        data: catalogItems = [],
        isLoading: catalogLoading
    } = useQuery({
        queryKey: ['catalog'],
        queryFn: async (context) => {
            const showNotification = context.meta?.showNotification as boolean ?? false;
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
        staleTime: 60000, // Catalog data remains fresh for 1 minute
        gcTime: 300000
    });

    // Persist catalog to localStorage
    useEffect(() => {
        if (catalogItems && catalogItems.length > 0) {
            localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(catalogItems));
        }
    }, [catalogItems]);

    // Load initial catalog from localStorage
    useEffect(() => {
        const cachedCatalog = localStorage.getItem(STORAGE_KEYS.catalog);
        if (cachedCatalog && queryClient && catalogItems.length === 0) {
            try {
                const parsedCatalog = JSON.parse(cachedCatalog) as CatalogItemWithName[];
                queryClient.setQueryData(['catalog'], parsedCatalog);
            } catch (e) {
                console.error('Failed to parse cached catalog:', e);
            }
        }
    }, [queryClient, catalogItems]);

    // Load registry with React Query
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

    // Persist registry to localStorage
    useEffect(() => {
        if (registryItems) {
            localStorage.setItem(STORAGE_KEYS.registry, JSON.stringify(registryItems));
        }
    }, [registryItems]);

    // Load initial registry from localStorage
    useEffect(() => {
        const cachedRegistry = localStorage.getItem(STORAGE_KEYS.registry);
        if (cachedRegistry && queryClient && !registryItems) {
            try {
                const parsedRegistry = JSON.parse(cachedRegistry);
                queryClient.setQueryData(['registry'], parsedRegistry);
            } catch (e) {
                console.error('Failed to parse cached registry:', e);
            }
        }
    }, [queryClient, registryItems]);

    // Update secrets mutation
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

    // Register catalog item mutation
    const registerCatalogItemMutation = useMutation({
        mutationFn: async ({ item, showNotification }: { item: CatalogItemWithName, showNotification: boolean }) => {
            try {
                const currentRegistry = registryItems || {};
                const newRegistry = { ...currentRegistry, [item.name]: { ref: item.ref } };

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
                                    condition.required.forEach((requiredField: string) => {
                                        // Make sure each required field has at least an empty object if not already present
                                        if (!itemConfig[requiredField]) {
                                            itemConfig[requiredField] = {};
                                        }
                                    });
                                }
                            });
                        }
                    }

                    newRegistry[item.name] = { ref: item.ref, config: { [item.name]: itemConfig } };
                }

                const payload = escapeJSONForPlatformShell({
                    files: [{
                        path: 'registry.yaml',
                        content: stringify({ registry: newRegistry })
                    }]
                }, client.host.platform);
                await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', payload]);
                return { item, showNotification };
            } catch (error) {
                client.desktopUI.toast.error('Failed to register prompt: ' + error);
                throw error;
            }
        },
        onMutate: async ({ item }) => {
            // Cancel any outgoing refetches to avoid overwriting our optimistic update
            await queryClient.cancelQueries({ queryKey: ['registry'] });

            // Snapshot the previous value
            const previousRegistry = queryClient.getQueryData(['registry']);

            // Optimistically update to the new value
            const updatedRegistry = {
                ...(previousRegistry as Record<string, any> || {}),
                [item.name]: {
                    ref: item.ref,
                    config: item.config ? (config?.[item.name] || {}) : undefined
                }
            };

            queryClient.setQueryData(['registry'], updatedRegistry);

            // Return a context object with the snapshot
            return { previousRegistry };
        },
        onError: (err, variables, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousRegistry) {
                queryClient.setQueryData(['registry'], context.previousRegistry);
            }
        },
        onSuccess: ({ showNotification }) => {
            if (showNotification) {
                client.desktopUI.toast.success('Tile enabled. You may need to reload your MCP clients to apply.');
            }
            // We still refetch to ensure consistency with the server
            refetchRegistry();
            // Logic for showing reload modal would go here
        }
    });

    // Unregister catalog item mutation
    const unregisterCatalogItemMutation = useMutation({
        mutationFn: async (item: CatalogItemWithName) => {
            try {
                const currentRegistry = await getRegistry(client);
                delete currentRegistry[item.name];
                const payload = escapeJSONForPlatformShell({
                    files: [{
                        path: 'registry.yaml',
                        content: stringify({ registry: currentRegistry })
                    }]
                }, client.host.platform);
                await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', payload]);
                return item;
            } catch (error) {
                client.desktopUI.toast.error('Failed to unregister prompt: ' + error);
                throw error;
            }
        },
        onMutate: async (item) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['registry'] });

            // Snapshot the previous value
            const previousRegistry = queryClient.getQueryData(['registry']);

            // Create a copy of the registry without the unregistered item
            const updatedRegistry = { ...(previousRegistry as Record<string, any> || {}) };
            delete updatedRegistry[item.name];

            // Optimistically update
            queryClient.setQueryData(['registry'], updatedRegistry);

            // Return context with the snapshot
            return { previousRegistry };
        },
        onError: (err, variables, context) => {
            // Roll back to the previous value on error
            if (context?.previousRegistry) {
                queryClient.setQueryData(['registry'], context.previousRegistry);
            }
        },
        onSuccess: () => {
            client.desktopUI.toast.success('Tile turned off. You may need to reload your MCP clients to apply.');
            // Refetch to ensure consistency
            refetchRegistry();
            // Logic for showing reload modal would go here
        }
    });

    // Add this ref before the useEffect
    const prevSyncStateRef = useRef<{ config: any, registryItems: any }>({ config: null, registryItems: null });

    // Sync registry and config when both are available
    useEffect(() => {
        if (!registryItems || !config) return;

        // Skip if both objects haven't changed since last sync
        if (prevSyncStateRef.current.config === config &&
            prevSyncStateRef.current.registryItems === registryItems) {
            return;
        }

        // Perform deep comparison to prevent unnecessary syncs
        const needsSync = Object.keys(registryItems).some(key => {
            return registryItems[key].config &&
                (!config[key] || JSON.stringify(registryItems[key].config[key]) !== JSON.stringify(config[key]));
        });

        if (needsSync) {
            // Store current state before syncing to prevent loops
            prevSyncStateRef.current = { config, registryItems };
            syncConfigWithRegistryFromContext(registryItems);
        } else {
            // Still update reference to prevent future unnecessary comparisons
            prevSyncStateRef.current = { config, registryItems };
        }
    }, [registryItems, config, syncConfigWithRegistryFromContext]);

    const tryLoadSecrets = async () => {
        await refetchSecrets();
    };

    const tryLoadCatalog = async (showNotification = true) => {
        await queryClient.refetchQueries({
            queryKey: ['catalog'],
            type: 'active',
            exact: true
        });

        // Update catalog settings based on notification preference
        if (showNotification && catalogItems.length > 0) {
            client.desktopUI.toast.success('Catalog updated successfully.');
        }
    };

    const tryLoadRegistry = async () => {
        await refetchRegistry();
    };

    const registerCatalogItem = async (item: CatalogItemWithName, showNotification = true) => {
        await registerCatalogItemMutation.mutateAsync({ item, showNotification });
    };

    const unregisterCatalogItem = async (item: CatalogItemWithName) => {
        await unregisterCatalogItemMutation.mutateAsync(item);
    };

    const tryUpdateSecrets = async (secret: { name: string, value: string }) => {
        await updateSecretsMutation.mutateAsync(secret);
    };

    const getCanRegisterCatalogItem = useCallback((item: CatalogItemWithName) => {
        if (!canRegister) return false;

        const itemDeclaresConfig = item.config && item.config.length > 0;
        const itemDeclaresSecrets = item.secrets && item.secrets.length > 0;

        if (!itemDeclaresConfig && !itemDeclaresSecrets) return true;

        const emptyTemplate = getTemplateForItem(item);
        const filledTemplate = getTemplateForItem(item, config?.[item.name]);

        const unChangedConfig = !itemDeclaresConfig || JSON.stringify(emptyTemplate) === JSON.stringify(filledTemplate);
        const assignedSecrets = Secrets.getSecretsWithAssignment(item, secrets);
        const unAssignedSecrets = !itemDeclaresSecrets || assignedSecrets.filter(secret => !secret.assigned).length > 0;
        if (item.name === 'atlassian') {
            console.log(unChangedConfig, unAssignedSecrets);
        }
        return !unChangedConfig && !unAssignedSecrets;
    }, [canRegister, config, secrets]);

    const startPull = async () => {
        await Promise.all([
            loadAllImages(),
            tryLoadRegistry(),
            tryLoadConfig(),
            tryLoadCatalog(false),
            tryLoadSecrets(),
        ]);
    };

    const value = {
        secrets,
        catalogItems,
        registryItems,
        canRegister,
        secretsLoading,
        catalogLoading,
        registryLoading,
        tryLoadSecrets,
        tryLoadCatalog,
        tryLoadRegistry,
        registerCatalogItem,
        unregisterCatalogItem,
        startPull,
        tryUpdateSecrets,
        getCanRegisterCatalogItem,
    };

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
} 