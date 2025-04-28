import { v1 } from "@docker/extension-api-client-types";
import { parse, stringify } from "yaml";
import { REGISTRY_YAML } from "./Constants";
import { readFileInPromptsVolume, writeToPromptsVolume } from "./utils/Files";
import { mergeDeep } from "./MergeDeep";
import { ParsedParameters } from "./types/config";

export const getRegistry = async (client: v1.DockerDesktopClient) => {
  const parseRegistry = async () => {
    const registry = await readFileInPromptsVolume(client, REGISTRY_YAML);
    if (registry) {
      const value = parse(registry)["registry"] as {
        [key: string]: { ref: string; config: any };
      };
      if (!value) {
        client.desktopUI.toast.error(
          "Failed to parse registry.yaml: " + registry
        );
      }
      return value;
    }
    return {};
  };
  const writeRegistryIfNotExists = async () => {
    const registry = await readFileInPromptsVolume(client, REGISTRY_YAML);
    if (!registry) {
      await writeToPromptsVolume(client, REGISTRY_YAML, "registry: {}");
    }
  };
  try {
    await writeRegistryIfNotExists();
    return await parseRegistry();
  } catch (error) {
    client.desktopUI.toast.error("Failed to get prompt registry: " + error);
    return {};
  }
};

export const getStoredConfig = async (client: v1.DockerDesktopClient) => {
  const parseConfig = async () => {
    const config = await readFileInPromptsVolume(client, "config.yaml");
    if (config) {
      return parse(config) as Promise<{
        [key: string]: { [key: string]: ParsedParameters };
      }>;
    }
    return {};
  };
  const writeConfigIfNotExists = async () => {
    const config = await readFileInPromptsVolume(client, "config.yaml");
    if (!config) {
      await writeToPromptsVolume(client, "config.yaml", "{}");
    }
  };
  try {
    await writeConfigIfNotExists();
    return await parseConfig();
  } catch (error) {
    client.desktopUI.toast.error("Failed to get stored configs: " + error);
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
