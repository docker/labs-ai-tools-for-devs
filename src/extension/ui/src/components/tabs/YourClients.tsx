import { Chip, ListItem, ListItemText, List, Button, Tooltip, CircularProgress, Stack, Typography, Link, AlertTitle, Divider, AccordionSummary, Accordion, AccordionDetails } from "@mui/material";
import { IconButton } from "@mui/material";
import { Alert } from "@mui/material";
import { Box } from "@mui/material";
import { DOCKER_MCP_COMMAND } from "../../Constants";
import { ContentCopy, LinkOff, LinkRounded, SaveOutlined } from "@mui/icons-material";
import { MCPClientState } from "../../MCPClients";
import { v1 } from "@docker/extension-api-client-types";
import ClaudeIcon from '../../claude-ai-icon.svg'
import GordonIcon from '../../gordon-icon.png'
import CursorIcon from '../../cursor.svg'

type MCPClientSettingsProps = {
    mcpClientStates: { [name: string]: MCPClientState };
    onUpdate: () => Promise<void>;
    setButtonsLoading: (buttonsLoading: { [name: string]: boolean }) => void;
    buttonsLoading: { [name: string]: boolean };
    client: v1.DockerDesktopClient;
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

const MCPClientSettings = ({ mcpClientStates, onUpdate, setButtonsLoading, buttonsLoading, client }: MCPClientSettingsProps) =>
    <Box sx={{ width: '100%' }}>
        <Typography variant="h6">MCP Clients</Typography>
        <Stack direction="column" spacing={1} sx={{ p: 0 }}>
            {Object.entries(mcpClientStates).map(([name, mcpClientState]) => (
                <Stack key={name} direction="row" spacing={1} sx={{ marginTop: 2 }}>
                    <Accordion key={name} sx={{ width: '100%', marginRight: 1 }}>
                        <AccordionSummary sx={{ width: '100%' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {iconMap[name as keyof typeof iconMap] && <img src={iconMap[name as keyof typeof iconMap]} alt={name} style={{ width: '2em', height: '2em' }} />}
                                <Typography variant="h4">{name}</Typography>
                                {!mcpClientState.exists && <Chip label='No Config Found' color='error' />}
                                {mcpClientState.exists && <Chip label={mcpClientState.configured ? 'Connected' : 'Disconnected'} color={mcpClientState.configured ? 'success' : 'error'} />}
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <Stack direction="column" justifyContent="center" spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Link href={mcpClientState.client.url} target="_blank" rel="noopener noreferrer" onClick={() => client.host.openExternal(mcpClientState.client.url)}>{mcpClientState.client.url}</Link>
                                    </Stack>

                                    <Typography sx={{ fontWeight: 'bold' }}>Expected Config Path:</Typography>
                                    <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto', maxWidth: '80%', backgroundColor: 'grey.200', padding: 1, borderRadius: 1, fontSize: '12px' }}>
                                        {mcpClientState.client.expectedConfigPath?.[client.host.platform as 'win32' | 'darwin' | 'linux'] || 'N/A'}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>Manually Configure:</Typography>
                                </Stack>
                                <List sx={{ listStyleType: 'decimal', p: 0, pl: 2, mt: 1 }}>
                                    {mcpClientState.client.manualConfigSteps.map((step, index) => (
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
                                        await mcpClientState.client.disconnect(client)
                                        await onUpdate();
                                        setButtonsLoading({ ...buttonsLoading, [name]: false });
                                    }} disabled={buttonsLoading[name] || Boolean(mcpClientState.preventAutoConnectMessage)} color="warning" variant="outlined" size="small">
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
                                        await mcpClientState.client.connect(client)
                                        await onUpdate();
                                        setButtonsLoading({ ...buttonsLoading, [name]: false });
                                    }} disabled={buttonsLoading[name] || Boolean(mcpClientState.preventAutoConnectMessage)} color="primary" size="small">
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
                                        await mcpClientState.client.connect(client)
                                        await onUpdate();
                                        setButtonsLoading({ ...buttonsLoading, [name]: false });
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
        </Stack>
        <Divider />
        <Alert severity="info">
            <AlertTitle>Other MCP Clients</AlertTitle>
            You can connect other MCP clients to the same server by specifying the following command:
            <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1} sx={{ mt: 2 }}>
                <IconButton onClick={() => navigator.clipboard.writeText(DOCKER_MCP_COMMAND)}>
                    <ContentCopy />
                </IconButton>
                <Typography variant="caption" sx={theme => ({ backgroundColor: theme.palette.grey[200], padding: 1, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto' })}>
                    {DOCKER_MCP_COMMAND}
                </Typography>
            </Stack>
        </Alert>
    </Box >

export default MCPClientSettings;   