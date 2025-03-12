import { v1 } from "@docker/extension-api-client-types";
import { parse } from "yaml";
import { readFileInPromptsVolume, writeFileToPromptsVolume } from "./FileWatcher";

export const getRegistry = async (client: v1.DockerDesktopClient) => {
    const parseRegistry = async () => {
        const registry = await readFileInPromptsVolume(client, 'registry.yaml')
        if (registry) {
            return parse(registry)['registry'] as Promise<{ [key: string]: { ref: string; config: any } }>;
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