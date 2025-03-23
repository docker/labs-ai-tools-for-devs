import { v1 } from "@docker/extension-api-client-types";
import { getUser } from "../FileWatcher";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";

class ClaudeDesktopClient implements MCPClient {
    name = 'Claude Desktop'
    url = 'https://claude.ai/download'
    manualConfigSteps = [
        'Open Claude Desktop',
        'Select <strong>Claude Settings</strong>',
        'Click on the <strong>Developer</strong> tab',
        'Click on the <strong>Edit Config</strong> button',
        'Add MCP_DOCKER to <code>mcpServers</code> section:' +
        '<pre style="font-family: monospace; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
        JSON.stringify(SAMPLE_MCP_CONFIG, null, 2) +
        '</pre>'
    ]
    expectedConfigPath = {
        darwin: '/Users/$USER/Library/Application Support/Claude/claude_desktop_config.json',
        linux: '/home/$USER/.config/claude/claude_desktop_config.json',
        win32: '%APPDATA%\\Claude\\claude_desktop_config.json'
    }
    readFile = async (client: v1.DockerDesktopClient) => {
        const platform = client.host.platform
        let path = ''
        switch (platform) {
            case 'darwin':
                path = '/Users/$USER/Library/Application Support/Claude/claude_desktop_config.json'
                break;
            case 'linux':
                path = '/home/$USER/.config/claude/claude_desktop_config.json'
                break;
            case 'win32':
                path = '%APPDATA%\\Claude\\claude_desktop_config.json'
                break;
            default:
                throw new Error('Unsupported platform: ' + platform)
        }
        const user = await getUser(client)
        path = path.replace('$USER', user)
        try {
            const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/config.json`, 'alpine:latest', 'sh', '-c', `"cat /config.json"`])
            return { content: result.stdout || undefined, path: path };
        } catch (e) {
            return { content: null, path: path };
        }
    }
    connect = async (client: v1.DockerDesktopClient) => {
        const platform = client.host.platform
        let path = ''
        switch (platform) {
            case 'darwin':
                path = '/Users/$USER/Library/Application Support/Claude/'
                break;
            case 'linux':
                path = '/home/$USER/.config/claude/'
                break;
            case 'win32':
                path = '%APPDATA%\\Claude\\'
                break;
            default:
                throw new Error('Unsupported platform: ' + platform)
        }
        const user = await getUser(client)
        path = path.replace('$USER', user)
        let payload = {
            mcpServers: {
                MCP_DOCKER: SAMPLE_MCP_CONFIG.mcpServers.MCP_DOCKER
            }
        }
        try {
            const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/claude_desktop_config`, 'alpine:latest', 'sh', '-c', `"cat /claude_desktop_config/claude_desktop_config.json"`])
            if (result.stdout) {
                payload = JSON.parse(result.stdout)
                payload.mcpServers.MCP_DOCKER = SAMPLE_MCP_CONFIG.mcpServers.MCP_DOCKER
            }
        } catch (e) {
            // No config or malformed config found, overwrite it
        }
        try {
            await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/claude_desktop_config`, '--workdir', '/claude_desktop_config', 'vonwig/function_write_files:latest', `'${JSON.stringify({ files: [{ path: 'claude_desktop_config.json', content: JSON.stringify(payload) }] })}'`])
        } catch (e) {
            client.desktopUI.toast.error((e as any).stderr)
        }
    }
    disconnect = async (client: v1.DockerDesktopClient) => {
        const platform = client.host.platform
        let path = ''
        switch (platform) {
            case 'darwin':
                path = '/Users/$USER/Library/Application Support/Claude/'
                break;
            case 'linux':
                path = '/home/$USER/.config/claude/'
                break;
            case 'win32':
                path = '%APPDATA%\\Claude\\'
                break;
            default:
                throw new Error('Unsupported platform: ' + platform)
        }
        const user = await getUser(client)
        path = path.replace('$USER', user)
        try {
            // This method is only called after the config has been validated, so we can safely assume it's a valid config.
            const previousConfig = JSON.parse((await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/claude_desktop_config`, '--workdir', '/claude_desktop_config', 'alpine:latest', 'sh', '-c', `"cat /claude_desktop_config/claude_desktop_config.json"`])).stdout || '{}')
            const newConfig = { ...previousConfig }
            delete newConfig.mcpServers.MCP_DOCKER
            await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/claude_desktop_config`, '--workdir', '/claude_desktop_config', 'vonwig/function_write_files:latest', `'${JSON.stringify({ files: [{ path: 'claude_desktop_config.json', content: JSON.stringify(newConfig) }] })}'`])
        } catch (e) {
            client.desktopUI.toast.error((e as any).stderr)
        }
    }
    validateConfig = (content: string) => {
        const config = JSON.parse(content || '{}')
        return !!config.mcpServers?.MCP_DOCKER
    }
}

export default new ClaudeDesktopClient()