import { v1 } from "@docker/extension-api-client-types";
import { getUser } from "../FileWatcher";
import { MCPClient } from ".";
import { DOCKER_MCP_COMMAND } from "../Constants";
type CursorMCPConfig = {
    mcpServers: {
        identifier: string; // Random UUID
        name: string; // MCP_DOCKER
        command: string; // DOCKER_MCP_CONFIG.command + DOCKER_MCP_CONFIG.args.join(' ')
        type: 'stdio' | 'sse';
    }[]
}

const CURSOR_MCP_CONFIG: CursorMCPConfig['mcpServers'][number] = {
    command: DOCKER_MCP_COMMAND,
    name: 'MCP_DOCKER',
    identifier: 'mcp_docker-' + new Date().getTime(),
    type: 'stdio'
}

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
        darwin: '/Users/$USER/Library/Application Support/Cursor/User/globalStorage/state.vscdb',
        linux: '/home/$USER/.config/cursor/User/globalStorage/state.vscdb',
        win32: '%APPDATA%\\Cursor\\User\\globalStorage\\state.vscdb'
    }
    readFile = async (client: v1.DockerDesktopClient) => {
        const platform = client.host.platform
        let cursorDirectory = ''
        switch (platform) {
            case 'darwin':
                cursorDirectory = '/Users/$USER/Library/Application Support/Cursor/'
                break;
            case 'linux':
                cursorDirectory = '/home/$USER/.config/cursor/'
                break;
            case 'win32':
                cursorDirectory = '%APPDATA%\\Cursor\\'
                break;
            default:
                throw new Error('Unsupported platform: ' + platform)
        }
        const sqlFilePath = platform === 'win32' ? cursorDirectory + 'User\\globalStorage\\state.vscdb' : cursorDirectory + 'User/globalStorage/state.vscdb'
        // File is at: ~/Library/Application Support/Cursor/User/globalStorage/state.vscdb
        // Which is a sqlite db as you know, then you need SELECT value from ItemTable where key='src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser
        // Which gives you a JSON payload containing the key mcpServers: [] 
        const SQL_IMG = 'keinos/sqlite3:latest'
        const SQL_CMD = ['sqlite3', '"/state.vscdb"', '"SELECT value from ItemTable where key=\'src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser\'"']
        try {
            const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${sqlFilePath}",target=/state.vscdb`, SQL_IMG, ...SQL_CMD])
            return { content: result.stdout || undefined, path: sqlFilePath };
        } catch (e) {
            console.error(e)
            return { content: null, path: sqlFilePath };
        }
    }
    connect = async (client: v1.DockerDesktopClient) => {
        const config = await this.readFile(client)
        if (!config.content) {
            client.desktopUI.toast.error('No config found')
            return
        }
        const cursorConfig = JSON.parse(config.content) as CursorMCPConfig
        const mcpServer = cursorConfig.mcpServers.find(server => server.name === 'MCP_DOCKER')
        if (mcpServer) {
            client.desktopUI.toast.warning('You already have MCP Docker configured. If you are seeing this, something went wrong.')
            return
        }
        cursorConfig.mcpServers.push(CURSOR_MCP_CONFIG)
        const cursorConfigBlob = new Blob([JSON.stringify(cursorConfig)], { type: 'application/json' })
        const SQL_IMG = 'keinos/sqlite3:latest'
        const SQL_CMD = ['sqlite3', '"/state.vscdb"', `"UPDATE ItemTable SET value='${cursorConfigBlob}' where key='src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser'"`]
        try {
            await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${config.path}",target=/state.vscdb`, SQL_IMG, ...SQL_CMD])
            client.desktopUI.toast.success('Docker MCP Server connected to Cursor')
        } catch (e) {
            if ((e as any).stderr) {
                client.desktopUI.toast.error('Error updating Cursor config: ' + (e as any).stderr)
            } else {
                client.desktopUI.toast.error('Error updating Cursor config: ' + (e as any))
            }
        }
    }
    disconnect = async (client: v1.DockerDesktopClient) => {
        const config = await this.readFile(client)
        if (!config.content) {
            client.desktopUI.toast.error('No config found')
            return
        }
        const cursorConfig = JSON.parse(config.content) as CursorMCPConfig
        cursorConfig.mcpServers = cursorConfig.mcpServers.filter(server => server.name !== 'MCP_DOCKER')
        const SQL_IMG = 'keinos/sqlite3:latest'
        const SQL_CMD = ['sqlite3', "/state.vscdb", `"UPDATE ItemTable SET value='${JSON.stringify(cursorConfig)}' where key='src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser'"`]
        try {
            await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${config.path}",target=/state.vscdb`, SQL_IMG, ...SQL_CMD])
            client.desktopUI.toast.success('Docker MCP Server disconnected from Cursor')
        } catch (e) {
            client.desktopUI.toast.error((e as any))
        }
    }
    validateConfig = (content: string) => {
        const config = JSON.parse(content) as CursorMCPConfig
        return config.mcpServers.some(server => server.name === 'MCP_DOCKER')
    }
}

export default new CursorDesktopClient()