import { Chip, ListItem, ListItemText, List, Button, Tooltip, CircularProgress, Stack, Typography, Link, AlertTitle, Divider } from "@mui/material";
import { IconButton } from "@mui/material";
import { Alert } from "@mui/material";
import { Box } from "@mui/material";
import { DOCKER_MCP_COMMAND } from "../../Constants";
import { ContentCopy, LinkOff, LinkRounded, SaveOutlined } from "@mui/icons-material";
import { MCPClientState } from "../../MCPClients";
import { v1 } from "@docker/extension-api-client-types";

type MCPClientSettingsProps = {
    mcpClientStates: { [name: string]: MCPClientState };
    onUpdate: () => Promise<void>;
    setButtonsLoading: (buttonsLoading: { [name: string]: boolean }) => void;
    buttonsLoading: { [name: string]: boolean };
    client: v1.DockerDesktopClient;
}

const MCPClientSettings = ({ mcpClientStates, onUpdate, setButtonsLoading, buttonsLoading, client }: MCPClientSettingsProps) =>
    <Box sx={{ width: '100%' }}>
        <Typography variant="h6">MCP Clients</Typography>
        <List sx={{ p: 0 }}>
            {Object.entries(mcpClientStates).map(([name, mcpClientState]) => (
                <ListItem key={name}>
                    <ListItemText
                        disableTypography
                        primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="h4">{name}</Typography>
                                {!mcpClientState.exists && <Chip label='No Config Found' color='error' />}
                                {mcpClientState.exists && mcpClientState.client.name !== 'Gordon' && <Chip label={mcpClientState.configured ? 'Connected' : 'Disconnected'} color={mcpClientState.configured ? 'success' : 'error'} />}
                                {mcpClientState.exists && mcpClientState.client.name === 'Gordon' && <Chip label='Automatic Connection Not Supported' color='warning' />}
                                <Tooltip title={mcpClientState.preventAutoConnectMessage}>
                                    <span style={{ marginLeft: 'auto' }}>
                                        {mcpClientState.exists && mcpClientState.configured &&
                                            <Button onClick={async () => {
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
                                            <Button onClick={async () => {
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
                                            <Button color="error" variant="outlined" size="small" onClick={async () => {
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
                                    </span>
                                </Tooltip>
                            </Stack>
                        }
                        secondary={
                            <div>
                                <Stack direction="column" justifyContent="center" spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Link href={mcpClientState.client.url} target="_blank" rel="noopener noreferrer" onClick={() => client.host.openExternal(mcpClientState.client.url)}>{mcpClientState.client.url}</Link>
                                    </Stack>

                                    <Typography sx={{ fontWeight: 'bold' }}>Expected Config Path:</Typography>
                                    <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto', maxWidth: '80%', backgroundColor: 'grey.200', padding: 1, borderRadius: 1, fontSize: '12px' }}>
                                        {mcpClientState.client.expectedConfigPath[client.host.platform as 'win32' | 'darwin' | 'linux']}
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
                        }
                    />
                </ListItem>
            ))}
        </List>
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