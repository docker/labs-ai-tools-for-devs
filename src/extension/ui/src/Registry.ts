import { v1 } from '@docker/extension-api-client-types';
import { parse, stringify } from 'yaml';

import { CONFIG_YAML, REGISTRY_YAML } from './Constants';
import { ParsedParameters } from './types/config';
import { readFileInPromptsVolume, writeToPromptsVolume } from './utils/Files';

export const getRegistry = async (client: v1.DockerDesktopClient) => {
  try {
    const registry = await readFileInPromptsVolume(client, REGISTRY_YAML);
    if (registry) {
      return parse(registry)['registry'] as {
        [key: string]: { ref: string; config: any };
      };
    }

    await writeToPromptsVolume(client, REGISTRY_YAML, 'registry: {}');
    return {};
  } catch (error) {
    client.desktopUI.toast.error('Failed to get registry: ' + error);
    return {};
  }
};

export const getStoredConfig = async (client: v1.DockerDesktopClient) => {
  try {
    const config = await readFileInPromptsVolume(client, CONFIG_YAML);
    if (config) {
      return parse(config) as Promise<{
        [key: string]: { [key: string]: ParsedParameters };
      }>;
    }

    await writeToPromptsVolume(client, CONFIG_YAML, '{}');
    return {};
  } catch (error) {
    client.desktopUI.toast.error('Failed to get stored configs: ' + error);
    return {};
  }
};

// if registry.yaml has a config, it must be the same as what you have stored
// if that’s not true and the registry.yaml value is valid then you should sync with it
// if it’s not true and the registry.yaml is invalid then the catalog item needs user assistance because the catalog has probably been updated with a breaking change

//  Replace conflicting registry values with config values
export const syncRegistryWithConfig = async (
  client: v1.DockerDesktopClient,
  registry: { [key: string]: { ref: string; config: any } },
  config: { [key: string]: { [key: string]: ParsedParameters } }
) => {
  if (Object.keys(config).length === 0) {
    return;
  }
  if (Object.keys(registry).length === 0) {
    return;
  }
  const oldRegString = JSON.stringify(registry);
  for (const [itemName, itemConfig] of Object.entries(config)) {
    if (registry[itemName]) {
      registry[itemName].config = { [itemName]: itemConfig };
    }
  }
  const newRegString = JSON.stringify(registry);
  if (oldRegString !== newRegString) {
    await writeToPromptsVolume(client, REGISTRY_YAML, stringify({ registry }));
  }
  return registry;
};
