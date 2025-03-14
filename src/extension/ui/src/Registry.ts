import { v1 } from "@docker/extension-api-client-types";
import { parse, stringify } from "yaml";
import { readFileInPromptsVolume, writeFileToPromptsVolume } from "./FileWatcher";
import { ParsedParameters } from "./components/ConfigurationModal";
import { mergeDeep } from "./MergeDeep";

export const getRegistry = async (client: v1.DockerDesktopClient) => {
    const parseRegistry = async () => {
        const registry = await readFileInPromptsVolume(client, 'registry.yaml')
        if (registry) {
            const value = parse(registry)['registry'] as { [key: string]: { ref: string, config: any } }
            if (!value) {
                client.desktopUI.toast.error('Failed to get parse registry.yaml.registry: ' + registry)
            }
            return value;
        }
        return {};
    }
    const writeRegistryIfNotExists = async () => {
        const registry = await readFileInPromptsVolume(client, 'registry.yaml')
        if (!registry) {
            console.log('writeRegistryIfNotExists: no registry')
            await writeFileToPromptsVolume(client, JSON.stringify({ files: [{ path: 'registry.yaml', content: 'registry: {}' }] }))
        }
    }
    try {
        await writeRegistryIfNotExists()
        return await parseRegistry()
    }
    catch (error) {
        client.desktopUI.toast.error('Failed to get prompt registry: ' + error)
        return {};
    }
}

export const getStoredConfig = async (client: v1.DockerDesktopClient) => {
    const parseConfig = async () => {
        const config = await readFileInPromptsVolume(client, 'config.yaml')
        if (config) {
            return parse(config) as Promise<{ [key: string]: { [key: string]: ParsedParameters } }>;
        }
        return {};
    }
    const writeConfigIfNotExists = async () => {
        const config = await readFileInPromptsVolume(client, 'config.yaml')
        if (!config) {
            console.log('writeConfigIfNotExists: no config')
            await writeFileToPromptsVolume(client, JSON.stringify({ files: [{ path: 'config.yaml', content: '{}' }] }))
        }
    }
    try {
        await writeConfigIfNotExists()
        return await parseConfig()
    }
    catch (error) {
        client.desktopUI.toast.error('Failed to get stored configs: ' + error)
        return {};
    }
}

// if registry.yaml has a config, it must be the same as what you have stored
// if that’s not true and the registry.yaml value is valid then you should sync with it
// if it’s not true and the registry.yaml is invalid then the catalog item needs user assistance because the catalog has probably been updated with a breaking change

// Replace conflicting config values with registry values
export const syncConfigWithRegistry = async (client: v1.DockerDesktopClient, registry: { [key: string]: { ref: string, config: any } }, config: { [key: string]: { [key: string]: ParsedParameters } }) => {
    console.log('Attempting to sync config using registry.', 'registry', registry, 'config', config)
    for (const [registryItemName, registryItem] of Object.entries(registry)) {
        const configInRegistry = registryItem.config
        const configInConfigFile = config[registryItemName]
        if (configInConfigFile) {
            const mergedConfig = mergeDeep(configInConfigFile, configInRegistry)
            config[registryItemName] = mergedConfig
        }
    }
    await writeFileToPromptsVolume(client, JSON.stringify({ files: [{ path: 'config.yaml', content: stringify(config) }] }))
}

//  Replace conflicting registry values with config values
export const syncRegistryWithConfig = async (client: v1.DockerDesktopClient, registry: { [key: string]: { ref: string, config: any } }, config: { [key: string]: { [key: string]: ParsedParameters } }) => {
    console.log('Attempting to sync registry using config.', 'registry', registry, 'config', config)
    for (const [itemName, itemConfig] of Object.entries(config)) {
        const registryItem = registry[itemName]
        if (registryItem) {
            const mergedConfig = mergeDeep(registryItem.config, itemConfig)
            registry[itemName].config = mergedConfig
        }
    }
    await writeFileToPromptsVolume(client, JSON.stringify({ files: [{ path: 'registry.yaml', content: stringify({ registry }) }] }))
}
