import { v1 } from "@docker/extension-api-client-types";
import { getUser, readFileInPromptsVolume } from "./FileWatcher";

export const POLL_INTERVAL = 1000 * 30;
export const CATALOG_URL = 'https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml'
export const DOCKER_MCP_CONFIG = {
    "command": "docker",
    "args": [
        "run",
        "-i",
        "--rm",
        "alpine/socat",
        "STDIO",
        "TCP:host.docker.internal:8811"
    ]
}
export type MCPClient = {
    name: string;
    url: string;
    readFile: (client: v1.DockerDesktopClient) => Promise<{ content: string | null | undefined, path: string }>;
    connect: (client: v1.DockerDesktopClient) => Promise<void>;
    disconnect: (client: v1.DockerDesktopClient) => Promise<void>;
    validateConfig: (content: string) => boolean;
}

export const SUPPORTED_MCP_CLIENTS: MCPClient[] = [
    {
        name: 'Claude Desktop',
        url: 'https://claude.ai/download',
        readFile: async (client: v1.DockerDesktopClient) => {
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
        },
        connect: async (client: v1.DockerDesktopClient) => {
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
                    mcp_docker: DOCKER_MCP_CONFIG
                }
            }
            try {
                const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/claude_desktop_config`, 'alpine:latest', 'sh', '-c', `"cat /claude_desktop_config/claude_desktop_config.json"`])
                if (result.stdout) {
                    payload = JSON.parse(result.stdout)
                    payload.mcpServers.mcp_docker = DOCKER_MCP_CONFIG
                }
            } catch (e) {
                // No config or malformed config found, overwrite it
            }
            try {
                await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/claude_desktop_config`, '--workdir', '/claude_desktop_config', 'vonwig/function_write_files:latest', `'${JSON.stringify({ files: [{ path: 'claude_desktop_config.json', content: JSON.stringify(payload) }] })}'`])
            } catch (e) {
                client.desktopUI.toast.error((e as any).stderr)
            }
        },
        disconnect: async (client: v1.DockerDesktopClient) => {
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
                delete newConfig.mcpServers.mcp_docker
                await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/claude_desktop_config`, '--workdir', '/claude_desktop_config', 'vonwig/function_write_files:latest', `'${JSON.stringify({ files: [{ path: 'claude_desktop_config.json', content: JSON.stringify(newConfig) }] })}'`])
            } catch (e) {
                client.desktopUI.toast.error((e as any).stderr)
            }
        },
        validateConfig: (content: string) => {
            const config = JSON.parse(content)
            return Object.keys(config.mcpServers).some(key => key.includes('mcp_docker'))
        }
    }
]