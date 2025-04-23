import { createDockerDesktopClient } from '@docker/extension-api-client';
import LinkOff from '@mui/icons-material/LinkOff';
import LinkRounded from '@mui/icons-material/LinkRounded';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, CircularProgress, Divider, Link, List, ListItem, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

import ChatGPTIcon from '../../assets/chatgpt.svg';
import ClaudeIcon from '../../assets/claude-ai-icon.svg';
import CursorIcon from '../../assets/cursor.svg';
import GordonIcon from '../../assets/gordon-icon.png';
import { CATALOG_LAYOUT_SX, DOCKER_MCP_COMMAND } from "../../Constants";

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

type MCPClientSettingsProps = {
    appProps: any; // Pass the app props from the parent
    ddVersion: { version: string, build: number };
}

const connectionButtonSX = {
    maxHeight: '4em',
    minWidth: '11em',
}

const iconMap = {
    'Claude Desktop': ClaudeIcon,
    'Gordon': GordonIcon,
    'Cursor': CursorIcon,
}

const MCPClientSettings = ({ appProps, ddVersion }: MCPClientSettingsProps) => {
    // Extract all the values we need from appProps
    const {
        mcpClientStates,
        buttonsLoading,
        setButtonsLoading,
        disconnectClient,
        connectClient
    } = appProps;

    if (!mcpClientStates) {
        return <>
            <CircularProgress />
            <Typography>Loading MCP clients...</Typography>
        </>
    }

    const [copyButtonText, setCopyButtonText] = useState('Copy');

    return (
        <Box sx={CATALOG_LAYOUT_SX}>
            <Typography>Connect to runtimes for your tools</Typography>
            <Stack direction="column" spacing={1} sx={{ p: 0 }}>
                {Object.entries(mcpClientStates).map(([name, mcpClientState]: [string, any]) => (
                    <Stack key={name} direction="row" spacing={1} sx={{ marginTop: 2 }}>
                        <Accordion key={name} sx={{ width: '100%', marginRight: 1 }}>
                            <AccordionSummary sx={{ width: '100%', fontSize: '1.5em', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                                {iconMap[name as keyof typeof iconMap] && <img src={iconMap[name as keyof typeof iconMap]} alt={name} style={{ width: '2em', height: '2em' }} />}
                                <Stack direction="column" sx={{ marginLeft: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Typography variant="h4">{name}</Typography>
                                        {!mcpClientState.exists && <Chip label='No Config Found' color='error' />}
                                        {mcpClientState.exists && <Chip label={mcpClientState.configured ? 'Connected' : 'Disconnected'} color={mcpClientState.configured ? 'success' : 'error'} />}
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="caption">Connect MCP to {name}</Typography>
                                    </Stack>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <Stack direction="column" justifyContent="center" spacing={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Link href={mcpClientState.client.url} target="_blank" rel="noopener noreferrer" onClick={() => client.host.openExternal(mcpClientState.client.url)}>{mcpClientState.client.url}</Link>
                                        </Stack>
                                        <Typography sx={{ fontWeight: 'bold' }}>Expected Config Path:</Typography>
                                        <Typography component="pre" sx={{ color: 'text.primary', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto', maxWidth: '80%', backgroundColor: 'background.default', padding: 1, borderRadius: 1, fontSize: '12px' }}>
                                            {mcpClientState.client.expectedConfigPath?.[client.host.platform as 'win32' | 'darwin' | 'linux'] || 'N/A'}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>Manually Configure:</Typography>
                                    </Stack>
                                    <List sx={{ listStyleType: 'decimal', p: 0, pl: 2, mt: 1 }}>
                                        {mcpClientState.client.manualConfigSteps.map((step: string, index: number) => (
                                            <ListItem sx={{ display: 'list-item', p: 0 }} key={index}>
                                                <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: step }} />} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Tooltip sx={{ alignSelf: 'baseline' }} title={mcpClientState.preventAutoConnectMessage}>
                            <Stack direction="row" alignItems="space-between" spacing={1} sx={{ marginLeft: 'auto' }}>
                                {mcpClientState.exists && mcpClientState.configured &&
                                    <Button
                                        sx={connectionButtonSX}
                                        onClick={async () => {
                                            setButtonsLoading({ ...buttonsLoading, [name]: true });
                                            try {
                                                await disconnectClient(name);
                                            } finally {
                                                setButtonsLoading({ ...buttonsLoading, [name]: false });
                                            }
                                        }}
                                        disabled={buttonsLoading[name] || Boolean(mcpClientState.preventAutoConnectMessage)}
                                        color="warning"
                                        variant="outlined"
                                        size="small">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography>Disconnect</Typography>
                                            <LinkOff />
                                            {buttonsLoading[name] && <CircularProgress size={16} />}
                                        </Stack>
                                    </Button>
                                }
                                {mcpClientState.exists && !mcpClientState.configured &&
                                    <Button
                                        sx={connectionButtonSX}
                                        onClick={async () => {
                                            setButtonsLoading({ ...buttonsLoading, [name]: true });
                                            try {
                                                await connectClient(name);
                                            } finally {
                                                setButtonsLoading({ ...buttonsLoading, [name]: false });
                                            }
                                        }}
                                        disabled={buttonsLoading[name] || Boolean(mcpClientState.preventAutoConnectMessage)}
                                        color="primary"
                                        size="small">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography>Connect</Typography>
                                            <LinkRounded />
                                            {buttonsLoading[name] && <CircularProgress size={16} />}
                                        </Stack>
                                    </Button>
                                }
                                {!mcpClientState.exists &&
                                    <Button
                                        sx={connectionButtonSX}
                                        color="error"
                                        variant="outlined"
                                        size="small"
                                        onClick={async () => {
                                            setButtonsLoading({ ...buttonsLoading, [name]: true });
                                            try {
                                                await connectClient(name);
                                            } finally {
                                                setButtonsLoading({ ...buttonsLoading, [name]: false });
                                            }
                                        }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <SaveOutlined />
                                            <Typography>Write Config</Typography>
                                            {buttonsLoading[name] && <CircularProgress size={16} />}
                                        </Stack>
                                    </Button>
                                }
                            </Stack>
                        </Tooltip>
                    </Stack>
                ))}
                <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
                    <Accordion disabled sx={{ width: '100%', marginRight: 1 }}>
                        <AccordionSummary sx={{ width: '100%' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <img src={ChatGPTIcon} alt="ChatGPT Desktop" style={{ width: '2em', height: '2em' }} />
                                <Typography variant="h4">ChatGPT Desktop</Typography>
                                {<Chip label='Coming Soon' color='info' />}
                            </Stack>
                        </AccordionSummary>
                    </Accordion>
                    <Tooltip sx={{ alignSelf: 'baseline' }} title={<Stack direction="column" spacing={1}>
                        <Typography>OpenAI has announced that MCP support is coming to ChatGPT Desktop. Please check back soon for updates.</Typography>
                    </Stack>}>
                        <Stack direction="row" alignItems="space-between" spacing={1} sx={{ marginLeft: 'auto' }}>
                            <Button
                                sx={connectionButtonSX}
                                disabled color="warning" variant="outlined" size="small">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography>Coming Soon</Typography>
                                </Stack>
                            </Button>
                        </Stack>
                    </Tooltip>
                </Stack>
            </Stack>
            <Divider sx={{ my: 4 }}>or</Divider>
            <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="h4">Other MCP Clients</Typography>
                You can connect other MCP clients to the same server by specifying the following command:
                <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>

                    <Typography variant="caption" sx={theme => ({ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200], padding: 1, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto', color: 'text.primary' })}>
                        {DOCKER_MCP_COMMAND}
                        <Button color={copyButtonText === 'Copied!' ? 'success' : 'primary'} sx={{ py: '2px', px: '12px', fontSize: '1em', ml: 1 }} onClick={() => {
                            navigator.clipboard.writeText(DOCKER_MCP_COMMAND);
                            setCopyButtonText('Copied!');
                            setTimeout(() => setCopyButtonText('Copy'), 2000);
                        }}>
                            {copyButtonText}
                        </Button>
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default MCPClientSettings;   