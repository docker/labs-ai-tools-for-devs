import React, { createContext, useContext, ReactNode, useRef } from 'react';
import { v1 } from "@docker/extension-api-client-types";
import { getStoredConfig, syncRegistryWithConfig } from '../Registry';
import { POLL_INTERVAL } from '../Constants';
import { escapeJSONForPlatformShell, tryRunImageSync } from '../FileWatcher';
import { stringify } from 'yaml';
import { ParsedParameters } from '../types/config';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

interface ConfigContextType {
    // State
    config: { [key: string]: { [key: string]: ParsedParameters } } | undefined;
    configLoading: boolean;

    // Actions
    tryLoadConfig: () => Promise<void>;
    saveConfig: (itemName: string, newConfig: { [key: string]: any }) => Promise<void>;
    syncConfigWithRegistry: (registryItems: { [key: string]: { ref: string; config: any } }) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function useConfigContext() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfigContext must be used within a ConfigProvider');
    }
    return context;
}

interface ConfigProviderProps {
    children: ReactNode;
    client: v1.DockerDesktopClient;
}

export function ConfigProvider({ children, client }: ConfigProviderProps) {
    const queryClient = useQueryClient();
    const configRef = useRef<any>(null);

    // Load config with React Query
    const {
        data: config = undefined,
        refetch: refetchConfig,
        isLoading: configLoading
    } = useQuery({
        queryKey: ['config'],
        queryFn: async () => {
            try {
                const response = await getStoredConfig(client);
                const result = response || {};
                // Store a deep copy of the config in the ref
                configRef.current = JSON.parse(JSON.stringify(result));
                return result;
            } catch (error) {
                client.desktopUI.toast.error('Failed to get stored config: ' + error);
                throw error;
            }
        },
        refetchInterval: POLL_INTERVAL,
        staleTime: 30000, // Data remains fresh for 30 seconds
        gcTime: 300000
    });

    // Save config mutation
    const saveConfigMutation = useMutation({
        mutationFn: async ({ itemName, newConfig }: { itemName: string, newConfig: { [key: string]: any } }) => {
            try {
                // Use the ref which contains the pre-optimistic update state
                const currentStoredConfig = { ...(configRef.current || {}) };
                const updatedConfig = { ...currentStoredConfig, [itemName]: newConfig };

                const payload = escapeJSONForPlatformShell({
                    files: [{
                        path: 'config.yaml',
                        content: stringify(updatedConfig)
                    }]
                }, client.host.platform);

                await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', payload]);

                // Update our ref with the new state after successful save
                configRef.current = JSON.parse(JSON.stringify(updatedConfig));
                return { itemName, updatedConfig };
            } catch (error) {
                client.desktopUI.toast.error('Failed to update config: ' + error);
                throw error;
            }
        },
        onMutate: async ({ itemName, newConfig }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['config'] });

            // Snapshot the previous value
            const previousConfig = queryClient.getQueryData(['config']);

            // Optimistically update to the new value
            const updatedConfig = {
                ...(previousConfig as Record<string, any> || {}),
                [itemName]: newConfig
            };

            queryClient.setQueryData(['config'], updatedConfig);

            return { previousConfig };
        },
        onError: (err, variables, context) => {
            // If the mutation fails, use the context to roll back
            if (context?.previousConfig) {
                queryClient.setQueryData(['config'], context.previousConfig);
            }
        },
        onSuccess: (data) => {
            client.desktopUI.toast.success('Config saved successfully.');
            // Update the cached data with the new config
            queryClient.setQueryData(['config'], data.updatedConfig);
        }
    });

    // Sync config with registry
    const syncRegistryMutation = useMutation({
        mutationFn: async (registryItems: { [key: string]: { ref: string; config: any } }) => {
            try {
                if (!config) return;
                await syncRegistryWithConfig(client, registryItems, config);
                return { success: true };
            } catch (error) {
                console.error('Failed to sync config with registry:', error);
                throw error;
            }
        }
    });

    const tryLoadConfig = async () => {
        await refetchConfig();
    };

    const saveConfig = async (itemName: string, newConfig: { [key: string]: any }) => {
        await saveConfigMutation.mutateAsync({ itemName, newConfig });
    };

    const syncConfigWithRegistry = async (registryItems: { [key: string]: { ref: string; config: any } }) => {
        await syncRegistryMutation.mutateAsync(registryItems);
    };

    const value = {
        config,
        configLoading,
        tryLoadConfig,
        saveConfig,
        syncConfigWithRegistry
    };

    return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
} 