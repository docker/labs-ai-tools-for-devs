import { v1 } from "@docker/extension-api-client-types";
import { parse, stringify } from "yaml";
import { readFileInPromptsVolume, writeFileToPromptsVolume } from "./FileUtils";
import { mergeDeep } from "./MergeDeep";
import { ParsedParameters } from "./types/config";

export const getRegistry = async (client: v1.DockerDesktopClient) => {
    const parseRegistry = async () => {
        const registry = await readFileInPromptsVolume(client, 'registry.yaml')
        if (registry) {
            const value = parse(registry)['registry'] as { [key: string]: { ref: string, config: any } }
            if (!value) {
                client.desktopUI.toast.error('Failed to parse registry.yaml: ' + registry)
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
    if (Object.keys(registry).length === 0) {
        console.log('No registry to sync with config.')
        return;
    }
    if (Object.keys(config).length === 0) {
        console.log('No config to sync with registry.')
        return;
    }
    console.log('SYNC STARTED. REGISTRY -> CONFIG', registry, config)
    const oldConfigString = JSON.stringify(config)
    for (const [registryItemName, registryItem] of Object.entries(registry)) {
        const configInRegistry = registryItem.config
        const configInConfigFile = config[registryItemName]
        if (configInConfigFile) {
            const mergedConfig = mergeDeep(configInConfigFile, configInRegistry)
            config[registryItemName][registryItemName] = mergedConfig
        }
    }
    const newConfigString = JSON.stringify(config)
    if (oldConfigString !== newConfigString) {
        console.log('Updating config with new registry.', 'oldConfigString', oldConfigString, 'newConfigString', newConfigString)
        await writeFileToPromptsVolume(client, JSON.stringify({ files: [{ path: 'config.yaml', content: stringify(config) }] }))
    }
    else {
        console.log('No registry changes to sync with config.', 'oldConfigString', oldConfigString, 'newConfigString', newConfigString)
    }
}

//  Replace conflicting registry values with config values
export const syncRegistryWithConfig = async (client: v1.DockerDesktopClient, registry: { [key: string]: { ref: string, config: any } }, config: { [key: string]: { [key: string]: ParsedParameters } }) => {
    if (Object.keys(config).length === 0) {
        console.log('No config to sync with registry.')
        return;
    }
    if (Object.keys(registry).length === 0) {
        console.log('No registry to sync with config.')
        return;
    }
    console.log('SYNC STARTED. CONFIG -> REGISTRY', config, registry)
    const oldRegString = JSON.stringify(registry)
    for (const [itemName, itemConfig] of Object.entries(config)) {
        const registryItem = registry[itemName]
        if (registryItem && registryItem.config?.[itemName]) {
            const mergedConfig = mergeDeep(registryItem.config[itemName] || {}, itemConfig)
            registry[itemName].config = { [itemName]: mergedConfig }
        }
    }
    const newRegString = JSON.stringify(registry)
    if (oldRegString !== newRegString) {
        console.log('Updating registry with new config.', 'oldRegString', oldRegString, 'newRegString', newRegString)
        await writeFileToPromptsVolume(client, JSON.stringify({ files: [{ path: 'registry.yaml', content: stringify({ registry }) }] }))
    }
    else {
        console.log('No config changes to sync with registry.', 'oldRegString', oldRegString, 'newRegString', newRegString)
    }
}
