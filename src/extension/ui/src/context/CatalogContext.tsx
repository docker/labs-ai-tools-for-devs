import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v1 } from "@docker/extension-api-client-types";
import { CatalogItemWithName } from '../components/tile/Tile';
import { getRegistry } from '../Registry';
import Secrets from '../Secrets';
import { parse } from 'yaml';
import { CATALOG_URL, POLL_INTERVAL } from '../Constants';
import { escapeJSONForPlatformShell, tryRunImageSync } from '../FileWatcher';
import { stringify } from 'yaml';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useConfigContext } from './ConfigContext';

// Storage keys for each query type
const STORAGE_KEYS = {
    secrets: 'docker-catalog-secrets',
    catalog: 'docker-catalog-catalog',
    registry: 'docker-catalog-registry',
    images: 'docker-catalog-images',
};

interface CatalogContextType {
    // State        
    secrets: Secrets.Secret[];
    catalogItems: CatalogItemWithName[];
    registryItems: { [key: string]: { ref: string; config: any } } | undefined;
    canRegister: boolean;
    imagesLoadingResults: ExecResult | null;
    secretsLoading: boolean;
    catalogLoading: boolean;
    registryLoading: boolean;
    imagesLoading: boolean;
    imagesIsFetching: boolean;

    // Actions
    tryLoadSecrets: () => Promise<void>;
    tryLoadCatalog: (showNotification?: boolean) => Promise<void>;
    tryLoadRegistry: () => Promise<void>;
    registerCatalogItem: (item: CatalogItemWithName, showNotification?: boolean) => Promise<void>;
    unregisterCatalogItem: (item: CatalogItemWithName) => Promise<void>;
    loadImagesIfNeeded: () => Promise<void>;
    startPull: () => Promise<void>;
    tryUpdateSecrets: (secret: { name: string, value: string }) => Promise<void>;
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
                if (showNotification) {
                    client.desktopUI.toast.error('Failed to get latest catalog.' + error);
                }
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

    // Load Docker images with React Query
    const {
        data: imagesLoadingResults = null,
        refetch: refetchImages,
        isLoading: imagesLoading,
        isFetching: imagesIsFetching
    } = useQuery({
        queryKey: ['images'],
        queryFn: async () => {
            try {
                const result = await client.docker.cli.exec('pull', ['vonwig/function_write_files:latest']);
                await client.docker.cli.exec('pull', ['alpine:latest']);
                return result;
            } catch (error) {
                console.error(error);
            }
        },
        staleTime: Infinity, // Only load images when explicitly requested
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    // Update secrets mutation
    const updateSecretsMutation = useMutation({
        mutationFn: async (secret: { name: string, value: string }) => {
            try {
                await Secrets.addSecret(client, { name: secret.name, value: secret.value, policies: [] });
                return secret;
            } catch (error) {
                client.desktopUI.toast.error('Failed to update secret: ' + error);
                throw error;
            }
        },
        onSuccess: () => {
            refetchSecrets();
        }
    });

    // Register catalog item mutation
    const registerCatalogItemMutation = useMutation({
        mutationFn: async ({ item, showNotification }: { item: CatalogItemWithName, showNotification: boolean }) => {
            try {
                const currentRegistry = registryItems || {};
                const newRegistry = { ...currentRegistry, [item.name]: { ref: item.ref } };
                if (item.config) {
                    newRegistry[item.name] = { ref: item.ref, config: config?.[item.name] || {} };
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
                if (showNotification) {
                    client.desktopUI.toast.error('Failed to register prompt: ' + error);
                }
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
                client.desktopUI.toast.success('Prompt registered successfully. Reload your MCP clients to apply.');
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
            client.desktopUI.toast.success('Prompt unregistered successfully. Reload your MCP clients to apply.');
            // Refetch to ensure consistency
            refetchRegistry();
            // Logic for showing reload modal would go here
        }
    });

    // Sync registry and config when both are available
    useEffect(() => {
        if (registryItems && config) {
            // Create a ref to check if we actually need to sync
            const needsSync = Object.keys(registryItems).some(key => {
                return registryItems[key].config &&
                    (!config[key] || JSON.stringify(registryItems[key].config) !== JSON.stringify(config[key]));
            });

            if (needsSync) {
                syncConfigWithRegistryFromContext(registryItems);
            }
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

    const loadImagesIfNeeded = async () => {
        await refetchImages();
    };

    const tryUpdateSecrets = async (secret: { name: string, value: string }) => {
        await updateSecretsMutation.mutateAsync(secret);
    };

    const startPull = async () => {
        await Promise.all([
            tryLoadRegistry(),
            tryLoadConfig(),
            tryLoadCatalog(false),
            tryLoadSecrets()
        ]);
    };

    const value = {
        secrets,
        catalogItems,
        registryItems,
        canRegister,
        imagesLoadingResults,
        secretsLoading,
        catalogLoading,
        registryLoading,
        imagesLoading,
        imagesIsFetching,
        tryLoadSecrets,
        tryLoadCatalog,
        tryLoadRegistry,
        registerCatalogItem,
        unregisterCatalogItem,
        loadImagesIfNeeded,
        startPull,
        tryUpdateSecrets
    };

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
} 