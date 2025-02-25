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
    readFile: (client: v1.DockerDesktopClient) => Promise<string | undefined | null>;
    writeFile: (client: v1.DockerDesktopClient, content: string) => Promise<void>;
    checkConfig: (content: string) => boolean;
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
                return result.stdout || undefined;
            } catch (e) {
                return null;
            }
        },
        writeFile: async (client: v1.DockerDesktopClient, content: string) => {
            const platform = client.host.platform
            let path = ''
            switch (platform) {
                case 'darwin':
                    path = '/Users/$USER/Library/Application Support/Claude Desktop/config.json'
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
            await client.docker.cli.exec('run', ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${JSON.stringify({ files: [{ path, content }] })}'`])
        },
        checkConfig: (content: string) => {
            const config = JSON.parse(content)
            return Object.keys(config.mcpServers).some(key => key.includes('mcp_docker'))
        }
    }
]