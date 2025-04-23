import { v1 } from "@docker/extension-api-client-types";
import { getStoredConfig, syncRegistryWithConfig } from '../Registry';
import { POLL_INTERVAL } from '../Constants';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CatalogItemRichened, CatalogItemWithName } from '../types/catalog';
import * as JsonSchemaLibrary from 'json-schema-library';
import { escapeJSONForPlatformShell, tryRunImageSync } from '../FileUtils';
import { stringify } from 'yaml';
import { useRef } from 'react';

export const getTemplateForItem = (item: CatalogItemWithName, existingConfigForItem: { [key: string]: any } = {}) => {
    const config = item.config;
    if (!config) return {};
    const schema = new JsonSchemaLibrary.Draft2019(config[0]);
    const template = schema.getTemplate(existingConfigForItem);
    return template;
};

export function useConfig(client: v1.DockerDesktopClient) {
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
        gcTime: 300000,
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
                const updatedConfigRef = JSON.parse(JSON.stringify(updatedConfig));
                configRef.current = updatedConfigRef;
                return { itemName, updatedConfig: updatedConfigRef };
            } catch (error) {
                client.desktopUI.toast.error('Failed to update config: ' + error);
                // Treat YAML file write failures as fatal, no rollback
                throw error;
            }
        },
        onMutate: async ({ itemName, newConfig }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['config'] });

            // Optimistically update to the new value
            const updatedConfig = {
                ...(queryClient.getQueryData(['config']) as Record<string, any> || {}),
                [itemName]: newConfig
            };

            queryClient.setQueryData(['config'], updatedConfig);
        },
        onSuccess: (data) => {
            client.desktopUI.toast.success('Config saved successfully.');
            // Update the cached data with the new config
            queryClient.setQueryData(['config'], data.updatedConfig);
        }
    });

    // Sync config with registry - use the exact types from Registry.ts
    const syncRegistryMutation = useMutation({
        mutationFn: async (registryItems: { [key: string]: { ref: string; config: any } }) => {
            try {
                if (!config) return { success: false };
                await syncRegistryWithConfig(client, registryItems, config);
                return { success: true };
            } catch (error) {
                console.error('Failed to sync config with registry:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            // Refetch config to ensure UI is in sync after registry sync
            await refetchConfig();
        }
    });

    const tryLoadConfig = async () => {
        await refetchConfig();
    };

    const saveConfig = async (itemName: string, newConfig: { [key: string]: any }) => {
        try {
            await saveConfigMutation.mutateAsync({ itemName, newConfig });
            // Force a direct refetch from the data source to ensure we have the latest data
            await refetchConfig();
        } catch (error) {
            console.error("Error saving config:", error);
            throw error;
        }
    };

    // Make this function handle both with and without config, by ensuring config is present
    const syncConfigWithRegistry = async (registryItems: { [key: string]: { ref: string; config?: any } }) => {
        // Convert to the format expected by syncRegistryWithConfig
        const formattedRegistry: { [key: string]: { ref: string; config: any } } = {};

        // Ensure all registry items have a config property, even if empty
        for (const [key, item] of Object.entries(registryItems)) {
            formattedRegistry[key] = {
                ref: item.ref,
                config: item.config || {}
            };
        }

        await syncRegistryMutation.mutateAsync(formattedRegistry);
    };

    return {
        config,
        configLoading,
        tryLoadConfig,
        saveConfig,
        syncConfigWithRegistry
    };
} 