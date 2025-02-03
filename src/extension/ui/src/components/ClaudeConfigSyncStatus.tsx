import { v1 } from "@docker/extension-api-client-types";
import { Badge, Button, Checkbox, Dialog, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { writeFilesToHost } from "../FileWatcher";
import { trackEvent } from "../Usage";

const DOCKER_MCP_CONFIG = {
    "command": "docker",
    "args": [
        "run",
        "--rm",
        "-i",
        "--pull",
        "always",
        "-v",
        "/var/run/docker.sock:/var/run/docker.sock",
        "--mount",
        "type=volume,source=docker-prompts,target=/prompts",
        "mcp/docker:latest",
        "serve",
        "--mcp",
        "--register",
        "github:docker/labs-ai-tools-for-devs?path=prompts/bootstrap.md"
    ]
}

type ClaudeConfigStatus = {
    state: string,
    message: string,
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

const getClaudeConfigPath = (client: v1.DockerDesktopClient) => {
    const platform = client.host.platform
    switch (platform) {
        case 'darwin':
            return '/Users/$USER/Library/Application Support/Claude/claude_desktop_config.json'
        case 'linux':
            return '/home/$USER/.config/claude/claude_desktop_config.json'
        case 'win32':
            return '"%APPDATA%\\Claude\\claude_desktop_config.json"'
        default:
            throw new Error('Unsupported platform: ' + platform)
    }
}

const getClaudeConfig = async (client: v1.DockerDesktopClient) => {
    const path = getClaudeConfigPath(client)
    const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/config.json`, 'alpine:latest', 'sh', '-c', `"cat /config.json"`])
    localStorage.setItem('claude-config-sync-status-path', result.stdout)
    return result.stdout
}


export const setNeverShowAgain = (value: boolean) => {
    localStorage.setItem('claude-config-sync-status-never-show-again', value.toString())
}

const getNeverShowAgain = () => {
    return localStorage.getItem('claude-config-sync-status-never-show-again') === 'true'
}

export const ClaudeConfigSyncStatus = ({ client, setHasConfig }: { client: v1.DockerDesktopClient, setHasConfig: (hasConfig: boolean) => void }) => {
    const [claudeConfig, setClaudeConfig] = useState<{ mcpServers: { [key: string]: any } } | null>(null)
    const [showConfigModal, setShowConfigModal] = useState<boolean>(false)
    const [showRestartModal, setShowRestartModal] = useState<boolean>(false)
    const [status, setStatus] = useState<ClaudeConfigStatus>({ state: 'loading', message: '...', color: 'default' })
    const [configPath, setConfigPath] = useState<string | null>(null)
    useEffect(() => {
        const refreshConfig = async () => {
            try {
                const config = await getClaudeConfig(client)
                const newConfig = JSON.parse(config)
                setClaudeConfig(newConfig)

            } catch (error) {
                console.error('Error parsing config. Using cached config if available.', error)
            }

        }
        refreshConfig()
        const interval = setInterval(() => {
            refreshConfig()
        }, 30000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        setConfigPath(getClaudeConfigPath(client))
    }, [client])


    useEffect(() => {
        if (claudeConfig) {
            const servers = claudeConfig.mcpServers
            if (!servers) {
                setStatus({ state: 'invalid', message: 'No servers found in Claude Desktop Config', color: 'error' })
            }
            else {
                const hasDocker = Object.keys(servers).some(key => key === 'mcp_docker')
                if (hasDocker) {
                    setStatus({ state: 'has docker_mcp', message: 'Claude Desktop Config is valid', color: 'success' })
                    setHasConfig(true)
                } else {
                    setStatus({ state: 'missing docker_mcp', message: 'No Docker servers found in Claude Desktop Config', color: 'error' })
                    setHasConfig(false)
                }
            }
        }
    }, [claudeConfig])

    return <Badge badgeContent={status.state} color={status.color} sx={{ ml: 4 }}>
        <Dialog open={Boolean(showConfigModal && configPath)} onClose={() => setShowConfigModal(false)} maxWidth="lg">
            <DialogTitle>Current Claude Desktop Config</DialogTitle>

            {status.state === 'has docker_mcp' && <Button onClick={async () => {
                trackEvent('claude-config-changed', { action: 'remove' })
                // Remove docker_mcp from config
                if (claudeConfig && claudeConfig.mcpServers) {
                    const newConfig = { ...claudeConfig }
                    delete newConfig.mcpServers.mcp_docker
                    setClaudeConfig(newConfig)
                    await writeFilesToHost(client, [{ path: 'config.json', content: JSON.stringify(newConfig, null, 2) }], [{ source: configPath!, target: '/claude_desktop_config/config.json' }], '/claude_desktop_config')
                    setShowRestartModal(!getNeverShowAgain())
                    setShowConfigModal(false)
                }
            }}>Remove Docker MCP</Button>}

            {status.state === 'missing docker_mcp' && <Button onClick={() => {
                trackEvent('claude-config-changed', { action: 'add' })
                // Add docker_mcp to config
                if (claudeConfig && claudeConfig.mcpServers) {
                    const newConfig = { ...claudeConfig }
                    newConfig.mcpServers.mcp_docker = DOCKER_MCP_CONFIG
                    setClaudeConfig(newConfig)
                    writeFilesToHost(client, [{ path: 'config.json', content: JSON.stringify(newConfig, null, 2) }], [{ source: configPath!, target: '/claude_desktop_config/config.json' }], '/claude_desktop_config')
                    setShowRestartModal(!getNeverShowAgain())
                    setShowConfigModal(false)
                }
            }}>Add Docker MCP</Button>
            }
            <DialogContent>
                <DialogContentText component='pre'>
                    <Typography >{JSON.stringify(claudeConfig, null, 2)}</Typography>
                </DialogContentText>
            </DialogContent>
        </Dialog >

        <Dialog open={showRestartModal} onClose={() => setShowRestartModal(false)} >
            <DialogTitle>Config Changes Applied</DialogTitle>
            <DialogContent sx={{ padding: 5, mt: 2 }}>
                <Stack direction="column" spacing={3}>
                    <Typography>
                        Claude config has been updated.  Please restart Claude Desktop to apply the changes.
                    </Typography>
                    <FormControlLabel control={<Checkbox defaultChecked={getNeverShowAgain()} onChange={(e) => setNeverShowAgain(e.target.checked)} />} label="Don't show this again" />
                    <Button onClick={() => {
                        setShowRestartModal(false)
                    }}>Close</Button>
                </Stack>
            </DialogContent>
        </Dialog >
        <Button sx={{ width: 150, height: 'auto', cursor: 'pointer' }} onClick={() => { setShowConfigModal(!showConfigModal) }} color='primary' variant="outlined">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 40" fill="currentColor"><path shapeRendering="optimizeQuality" fill="#D97757" d="m7.75 26.27 7.77-4.36.13-.38-.13-.21h-.38l-1.3-.08-4.44-.12-3.85-.16-3.73-.2-.94-.2L0 19.4l.09-.58.79-.53 1.13.1 2.5.17 3.75.26 2.72.16 4.03.42h.64l.09-.26-.22-.16-.17-.16-3.88-2.63-4.2-2.78-2.2-1.6L3.88 11l-.6-.76-.26-1.66L4.1 7.39l1.45.1.37.1 1.47 1.13 3.14 2.43 4.1 3.02.6.5.24-.17.03-.12-.27-.45L13 9.9l-2.38-4.1-1.06-1.7-.28-1.02c-.1-.42-.17-.77-.17-1.2L10.34.21l.68-.22 1.64.22.69.6 1.02 2.33 1.65 3.67 2.56 4.99.75 1.48.4 1.37.15.42h.26v-.24l.21-2.81.39-3.45.38-4.44.13-1.25.62-1.5L23.1.57l.96.46.79 1.13-.11.73-.47 3.05-.92 4.78-.6 3.2h.35l.4-.4 1.62-2.15 2.72-3.4 1.2-1.35 1.4-1.49.9-.71h1.7l1.25 1.86-.56 1.92-1.75 2.22-1.45 1.88-2.08 2.8-1.3 2.24.12.18.31-.03 4.7-1 2.54-.46 3.03-.52 1.37.64.15.65-.54 1.33-3.24.8-3.8.76-5.66 1.34-.07.05.08.1 2.55.24 1.09.06h2.67l4.97.37 1.3.86.78 1.05-.13.8-2 1.02-2.7-.64-6.3-1.5-2.16-.54h-.3v.18l1.8 1.76 3.3 2.98 4.13 3.84.21.95-.53.75-.56-.08-3.63-2.73-1.4-1.23-3.17-2.67h-.21v.28l.73 1.07 3.86 5.8.2 1.78-.28.58-1 .35-1.1-.2L26 33.14l-2.33-3.57-1.88-3.2-.23.13-1.11 11.95-.52.61-1.2.46-1-.76-.53-1.23.53-2.43.64-3.17.52-2.52.47-3.13.28-1.04-.02-.07-.23.03-2.36 3.24-3.59 4.85-2.84 3.04-.68.27-1.18-.61.11-1.09.66-.97 3.93-5 2.37-3.1 1.53-1.79-.01-.26h-.09L6.8 30.56l-1.86.24-.8-.75.1-1.23.38-.4 3.14-2.16Z"></path><path shapeRendering="optimizeQuality" d="M64.48 33.54c-5.02 0-8.45-2.8-10.07-7.11a19.19 19.19 0 0 1-1.23-7.03c0-7.23 3.24-12.25 10.4-12.25 4.81 0 7.78 2.1 9.47 7.11h2.06l-.28-6.91c-2.88-1.86-6.48-2.8-10.86-2.8-6.17 0-11.42 2.76-14.34 7.74a16.77 16.77 0 0 0-2.22 8.65c0 5.53 2.61 10.43 7.51 13.15a17.51 17.51 0 0 0 8.73 2.06c4.78 0 8.57-.91 11.93-2.5l.87-7.62h-2.1c-1.26 3.48-2.76 5.57-5.25 6.68-1.22.55-2.76.83-4.62.83ZM86.13 7.15l.2-3.4h-1.42l-6.32 1.9v1.03l2.8 1.3v23.78c0 1.62-.83 1.98-3 2.25v1.74h10.75v-1.74c-2.18-.27-3-.63-3-2.25V7.16Zm42.75 29h.83l7.27-1.38v-1.78l-1.02-.08c-1.7-.16-2.14-.51-2.14-1.9V18.33l.2-4.07h-1.15l-6.87.99v1.74l.67.12c1.86.27 2.41.79 2.41 2.09v11.3c-1.78 1.38-3.48 2.25-5.5 2.25-2.24 0-3.63-1.14-3.63-3.8V18.34l.2-4.07h-1.18l-6.88.99v1.74l.71.12c1.86.27 2.41.79 2.41 2.09v10.43c0 4.42 2.5 6.52 6.48 6.52 3.04 0 5.53-1.62 7.4-3.87l-.2 3.87ZM108.9 22.08c0-5.65-3-7.82-8.42-7.82-4.78 0-8.25 1.98-8.25 5.26 0 .98.35 1.73 1.06 2.25l3.64-.48c-.16-1.1-.24-1.77-.24-2.05 0-1.86.99-2.8 3-2.8 2.97 0 4.47 2.09 4.47 5.45v1.1l-7.5 2.25c-2.5.68-3.92 1.27-4.87 2.65a5 5 0 0 0-.7 2.8c0 3.2 2.2 5.46 5.96 5.46 2.72 0 5.13-1.23 7.23-3.56.75 2.33 1.9 3.56 3.95 3.56 1.66 0 3.16-.67 4.5-1.98l-.4-1.38c-.58.16-1.14.24-1.73.24-1.15 0-1.7-.91-1.7-2.69v-8.26Zm-9.6 10.87c-2.05 0-3.32-1.19-3.32-3.28 0-1.42.67-2.25 2.1-2.73l6.08-1.93v5.84c-1.94 1.47-3.08 2.1-4.86 2.1Zm63.3 1.82v-1.78l-1.03-.08c-1.7-.16-2.13-.51-2.13-1.9V7.15l.2-3.4h-1.43l-6.32 1.9v1.03l2.8 1.3v7.82a8.83 8.83 0 0 0-5.37-1.54c-6.28 0-11.18 4.78-11.18 11.93 0 5.89 3.52 9.96 9.32 9.96 3 0 5.61-1.46 7.23-3.72l-.2 3.72h.84l7.27-1.38Zm-13.16-18.14c3 0 5.25 1.74 5.25 4.94v9a7.2 7.2 0 0 1-5.21 2.1c-4.3 0-6.48-3.4-6.48-7.94 0-5.1 2.49-8.1 6.44-8.1Zm28.53 4.5c-.56-2.64-2.18-4.14-4.43-4.14-3.36 0-5.69 2.53-5.69 6.16 0 5.37 2.84 8.85 7.43 8.85a8.6 8.6 0 0 0 7.39-4.35l1.34.36c-.6 4.66-4.82 8.14-10 8.14-6.08 0-10.27-4.5-10.27-10.9 0-6.45 4.55-10.99 10.63-10.99 4.54 0 7.74 2.73 8.77 7.47l-15.84 4.86v-2.14l10.67-3.31Z"></path></svg>
        </Button>
    </Badge>
}