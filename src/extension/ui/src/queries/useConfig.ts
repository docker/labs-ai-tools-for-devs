import { v1 } from '@docker/extension-api-client-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as JsonSchemaLibrary from 'json-schema-library';
import { stringify } from 'yaml';

import { CONFIG_YAML } from '../Constants';
import { getStoredConfig } from '../Registry';
import { CatalogItemWithName } from '../types/catalog';
import { writeToPromptsVolume } from '../utils/Files';

export const getTemplateForItem = (
  item: CatalogItemWithName,
  existingConfigForItem: { [key: string]: any } = {}
) => {
  const config = item.config;
  if (!config) return {};
  const schema = new JsonSchemaLibrary.Draft2019(config[0]);
  const template = schema.getTemplate(existingConfigForItem);
  return template;
};

export function useConfig(client: v1.DockerDesktopClient) {
  const queryClient = useQueryClient();

  const {
    data: config = undefined,
    refetch: refetchConfig,
    isLoading: configLoading,
  } = useQuery({
    queryKey: ['config'],
    networkMode: 'always',
    queryFn: async () => {
      try {
        const response = await getStoredConfig(client);
        const result = response || {};
        return result;
      } catch (error) {
        client.desktopUI.toast.error('Failed to get stored config: ' + error);
        throw error;
      }
    },
  });

  const saveConfigMutation = useMutation({
    mutationFn: async ({
      itemName,
      newConfig,
    }: {
      itemName: string;
      newConfig: { [key: string]: any };
    }) => {
      try {
        const updatedConfig = {
          ...((queryClient.getQueryData(['config']) as Record<string, any>) ||
            {}),
          [itemName]: newConfig,
        };

        await writeToPromptsVolume(
          client,
          CONFIG_YAML,
          stringify(updatedConfig)
        );

        const updatedConfigRef = JSON.parse(JSON.stringify(updatedConfig));
        return { itemName, updatedConfig: updatedConfigRef };
      } catch (error) {
        client.desktopUI.toast.error('Failed to update config: ' + error);
        throw error;
      }
    },
    onMutate: async ({ itemName, newConfig }) => {
      await queryClient.cancelQueries({ queryKey: ['config'] });

      const updatedConfig = {
        ...((queryClient.getQueryData(['config']) as Record<string, any>) ||
          {}),
        [itemName]: newConfig,
      };

      queryClient.setQueryData(['config'], updatedConfig);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['config'], data.updatedConfig);
    },
  });

  const tryLoadConfig = async () => {
    await refetchConfig();
  };

  const saveConfig = async (
    itemName: string,
    newConfig: { [key: string]: any }
  ) => {
    try {
      await saveConfigMutation.mutateAsync({ itemName, newConfig });
      // Force a direct refetch from the data source to ensure we have the latest data
      await refetchConfig();
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  };

  return {
    config,
    configLoading,
    tryLoadConfig,
    saveConfig,
  };
}
