import { v1 } from "@docker/extension-api-client-types";
import { parse } from "yaml";
import { readFileInPromptsVolume, writeFileToPromptsVolume } from "./FileWatcher";

export const getRegistry = async (client: v1.DockerDesktopClient) => {
    const parseRegistry = async () => {
        const registry = await readFileInPromptsVolume(client, 'registry.yaml')
        return parse(registry)['registry'] as Promise<{ [key: string]: { ref: string } }>;
    }
    try {
        return await parseRegistry()
    }
    catch (error) {
        if (typeof error === 'object' && error && 'stderr' in error && error.stderr && (error.stderr as string).includes('No such file or directory')) {
            const payload = JSON.stringify({
                files: [{
                    path: 'registry.yaml',
                    content: 'registry: {}'
                }]
            })
            await writeFileToPromptsVolume(client, payload)
            return await parseRegistry();
        }
        client.desktopUI.toast.error('Failed to get prompt registry: ' + error)
        return {};
    }
}