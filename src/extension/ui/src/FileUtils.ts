/**
 * FileWatcher.ts
 * This file is not used due to inability to clean up inotifywait processes
 */
import { v1 } from "@docker/extension-api-client-types"
import { ExecResult } from "@docker/extension-api-client-types/dist/v0"
import { Serializable } from "child_process"

export const tryRunImageSync = async (client: v1.DockerDesktopClient, args: string[], ignoreError = false) => {
    const showError = ignoreError ? () => { } : client.desktopUI.toast.error
    try {
        const result = await client.docker.cli.exec('run', args)
        if (result.stderr) {
            showError(result.stderr)
        }
        return result.stdout || ''
    }
    catch (e) {
        if (e instanceof Error) {
            showError(e.message)
        }
        if ((e as ExecResult).stderr) {
            showError(JSON.stringify(e))
        }
        return ''
    }
}

export const getUser = async (client: v1.DockerDesktopClient) => {
    const result = await tryRunImageSync(client, ['--rm', '-e', 'USER', 'alpine:latest', 'sh', '-c', `"echo $USER"`])
    return result.trim()
}

export const readFileInPromptsVolume = async (client: v1.DockerDesktopClient, path: string) => {
    return tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'alpine:latest', 'sh', '-c', `"cat ${path}"`], true)
}

export const writeFileToPromptsVolume = async (client: v1.DockerDesktopClient, content: string) => {
    // Workaround for inability to use shell operators w/ DD extension API, use write_files image
    return tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${content}'`])
}

export const escapeJSONForPlatformShell = (json: Serializable, platform: string) => {
    const jsonString = JSON.stringify(json, null, 2)
    if (platform === 'win32') {
        // Use triple quotes to escape quotes
        return `"${jsonString.replace(/"/g, '\\"')}"`
    }
    return `'${jsonString}'`
}

