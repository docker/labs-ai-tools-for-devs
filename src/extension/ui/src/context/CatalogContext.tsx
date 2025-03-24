import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v1 } from "@docker/extension-api-client-types";
import { CatalogItemWithName } from '../components/tile/Tile';
import { getRegistry, getStoredConfig, syncConfigWithRegistry, syncRegistryWithConfig } from '../Registry';
import Secrets from '../Secrets';
import { parse } from 'yaml';
import { CATALOG_URL, POLL_INTERVAL } from '../Constants';
import { escapeJSONForPlatformShell, tryRunImageSync } from '../FileWatcher';
import { stringify } from 'yaml';
import { ParsedParameters } from '../components/ConfigurationModal';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';

interface CatalogContextType {
    // State
    config: { [key: string]: { [key: string]: ParsedParameters } } | undefined;
    secrets: Secrets.Secret[];
    catalogItems: CatalogItemWithName[];
    registryItems: { [key: string]: { ref: string; config: any } } | undefined;
    canRegister: boolean;
    imagesLoadingResults: ExecResult | null;

    // Actions
    tryLoadConfig: () => Promise<void>;
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
    const [config, setConfig] = useState<{ [key: string]: { [key: string]: ParsedParameters } } | undefined>(undefined);
    const [secrets, setSecrets] = useState<Secrets.Secret[]>([]);
    const [catalogItems, setCatalogItems] = useState<CatalogItemWithName[]>([]);
    const [registryItems, setRegistryItems] = useState<{ [key: string]: { ref: string; config: any } } | undefined>(undefined);
    const [canRegister, setCanRegister] = useState<boolean>(false);
    const [imagesLoadingResults, setImagesLoadingResults] = useState<ExecResult | null>(null);

    // Load config from storage
    const tryLoadConfig = async () => {
        try {
            const config = await getStoredConfig(client);
            setConfig(config);
        } catch (error) {
            client.desktopUI.toast.error('Failed to get stored config: ' + error);
        }
    };

    // Update secrets
    const tryUpdateSecrets = async (secret: { name: string, value: string }) => {
        try {
            await Secrets.addSecret(client, { name: secret.name, value: secret.value, policies: [] });
            await tryLoadSecrets();
        } catch (error) {
            client.desktopUI.toast.error('Failed to update secret: ' + error);
        }
    };

    // Load secrets
    const tryLoadSecrets = async () => {
        try {
            const response = await Secrets.getSecrets(client);
            setSecrets(response || []);
        } catch (error) {
            client.desktopUI.toast.error('Failed to get secrets: ' + error);
        }
    };

    // Load catalog
    const tryLoadCatalog = async (showNotification = true) => {
        const cachedCatalog = localStorage.getItem('catalog');
        try {
            const response = await fetch(CATALOG_URL);
            const catalog = await response.text();
            const items = parse(catalog)['registry'] as { [key: string]: any };
            const itemsWithName = Object.entries(items).map(([name, item]) => ({ name, ...item }));
            setCatalogItems(itemsWithName.reverse());
            localStorage.setItem('catalog', JSON.stringify(itemsWithName));
            if (showNotification) {
                client.desktopUI.toast.success('Catalog updated successfully.');
            }
        } catch (error) {
            if (cachedCatalog) {
                setCatalogItems(JSON.parse(cachedCatalog));
            }
            if (showNotification) {
                client.desktopUI.toast.error(`Failed to get latest catalog.${cachedCatalog ? ' Using cached catalog.' : ''}` + error);
            }
        }
    };

    // Load registry
    const tryLoadRegistry = async () => {
        setCanRegister(false);
        try {
            const result = await getRegistry(client);
            setRegistryItems(result || {});
        } catch (error) {
            if (error instanceof Error) {
                client.desktopUI.toast.error('Failed to get prompt registry: ' + error.message);
            } else {
                client.desktopUI.toast.error('Failed to get prompt registry: ' + JSON.stringify(error));
            }
        }
        setCanRegister(true);
    };

    // Register catalog item
    const registerCatalogItem = async (item: CatalogItemWithName, showNotification = true) => {
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
            if (showNotification) {
                client.desktopUI.toast.success('Prompt registered successfully. Reload your MCP clients to apply.');
            }
            await tryLoadRegistry();
            // Logic for showing reload modal would go here
        } catch (error) {
            if (showNotification) {
                client.desktopUI.toast.error('Failed to register prompt: ' + error);
            }
        }
    };

    // Unregister catalog item
    const unregisterCatalogItem = async (item: CatalogItemWithName) => {
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
            client.desktopUI.toast.success('Prompt unregistered successfully. Reload your MCP clients to apply.');
            await tryLoadRegistry();
            // Logic for showing reload modal would go here
        } catch (error) {
            client.desktopUI.toast.error('Failed to unregister prompt: ' + error);
        }
    };

    // Load Docker images
    const loadImagesIfNeeded = async () => {
        setImagesLoadingResults(null);
        try {
            const result = await client.docker.cli.exec('pull', ['vonwig/function_write_files:latest']);
            await client.docker.cli.exec('pull', ['alpine:latest']);
            await client.docker.cli.exec('pull', ['keinos/sqlite3:latest']);
            setImagesLoadingResults(result);
        } catch (error) {
            console.error(error);
            if (error) {
                setImagesLoadingResults(error as ExecResult);
            }
        }
    };

    // Start syncing process
    const startPull = async () => {
        await tryLoadRegistry();
        await tryLoadConfig();
        await tryLoadCatalog(false);
        await tryLoadSecrets();
    };

    const startSync = async () => {
        if (registryItems && config) {
            await syncConfigWithRegistry(client, registryItems, config);
            await syncRegistryWithConfig(client, registryItems, config);
        }
    }

    // Initialize everything
    useEffect(() => {
        loadImagesIfNeeded().then(() => {
            startPull();
            // Set up polling
            const interval = setInterval(() => {
                startPull();
            }, POLL_INTERVAL);

            return () => clearInterval(interval);
        });
    }, []);

    useEffect(() => {
        startSync();
    }, [registryItems, config])

    const value = {
        config,
        secrets,
        catalogItems,
        registryItems,
        canRegister,
        imagesLoadingResults,
        tryLoadConfig,
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