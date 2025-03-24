import { v1 } from "@docker/extension-api-client-types";
import { getUser } from "../FileWatcher";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";
import { DOCKER_MCP_COMMAND } from "../Constants";
import { mergeDeep } from "../MergeDeep";

class CursorDesktopClient implements MCPClient {
    name = 'Cursor'
    url = 'https://www.cursor.com/downloads'
    manualConfigSteps = [
        'Open <strong>Cursor Settings</strong>',
        'Click on the <strong>MCP</strong> tab',
        'Click on the <strong>Add new MCP server</strong> button',
        'Set name: <code>MCP_DOCKER</code>',
        'Set command: <pre style="font-family: monospace; white-space: nowrap; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
        DOCKER_MCP_COMMAND +
        '</pre>'
    ]
    expectedConfigPath = {
        darwin: '$HOME/.cursor/mcp.json',
        linux: '$HOME/.cursor/mcp.json',
        win32: '$USERPROFILE\\.cursor\\mcp.json'
    }
    readFile = async (client: v1.DockerDesktopClient) => {
        const platform = client.host.platform as keyof typeof this.expectedConfigPath
        const configPath = this.expectedConfigPath[platform].replace('$USER', await getUser(client))
        try {
            const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source=${configPath},target=/cursor_config/mcp.json`, 'alpine:latest', 'cat', '/cursor_config/mcp.json'])
            return {
                content: result.stdout,
                path: configPath
            }
        } catch (e) {
            return {
                content: null,
                path: configPath
            }
        }
    }
    connect = async (client: v1.DockerDesktopClient) => {
        const config = await this.readFile(client)
        let cursorConfig = null
        try {
            cursorConfig = JSON.parse(config.content || '{}') as typeof SAMPLE_MCP_CONFIG
            if (cursorConfig.mcpServers?.MCP_DOCKER) {
                client.desktopUI.toast.error('Docker MCP Server already connected to Cursor')
                return
            }
        } catch (e) {
            client.desktopUI.toast.error('Failed to connect. Invalid Cursor config found at ' + config.path)
            return
        }
        const payload = mergeDeep(cursorConfig, SAMPLE_MCP_CONFIG)
        try {
            await client.docker.cli.exec('run',
                [
                    '--rm',
                    '--mount',
                    `type=bind,source="${config.path}",target=/cursor_config/mcp.json`,
                    '--workdir',
                    '/cursor_config', 'vonwig/function_write_files:latest',
                    `'${JSON.stringify({ files: [{ path: 'mcp.json', content: JSON.stringify(payload) }] })}'`
                ]
            )
        } catch (e) {
            if ((e as any).stderr) {
                client.desktopUI.toast.error((e as any).stderr)
            } else {
                client.desktopUI.toast.error((e as Error).message)
            }
        }
        client.desktopUI.toast.success('Docker MCP Server connected to Cursor')
    }
    disconnect = async (client: v1.DockerDesktopClient) => {
        const config = await this.readFile(client)
        if (!config.content) {
            client.desktopUI.toast.error('No config found')
            return
        }
        let cursorConfig = null
        try {
            cursorConfig = JSON.parse(config.content) as typeof SAMPLE_MCP_CONFIG
            if (!cursorConfig.mcpServers?.MCP_DOCKER) {
                client.desktopUI.toast.error('Docker MCP Server not connected to Cursor')
                return
            }
        } catch (e) {
            client.desktopUI.toast.error('Failed to disconnect. Invalid Cursor config found at ' + config.path)
            return
        }
        const payload = {
            ...cursorConfig,
            mcpServers: Object.fromEntries(Object.entries(cursorConfig.mcpServers).filter(([key]) => key !== 'MCP_DOCKER'))
        }
        try {
            await client.docker.cli.exec('run',
                [
                    '--rm',
                    '--mount',
                    `type=bind,source="${config.path}",target=/cursor_config/mcp.json`,
                    '--workdir',
                    '/cursor_config', 'vonwig/function_write_files:latest',
                    `'${JSON.stringify({ files: [{ path: 'mcp.json', content: JSON.stringify(payload) }] })}'`
                ]
            )
        } catch (e) {
            if ((e as any).stderr) {
                client.desktopUI.toast.error((e as any).stderr)
            } else {
                client.desktopUI.toast.error((e as Error).message)
            }
        }
    }
    validateConfig = (content: string) => {
        const config = JSON.parse(content || '{}') as typeof SAMPLE_MCP_CONFIG
        return !!config.mcpServers?.MCP_DOCKER
    }
}

export default new CursorDesktopClient()