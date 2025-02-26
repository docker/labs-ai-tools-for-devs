import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    Chip,
    Stack,
    Grid2,
    Link,
    CircularProgress,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ContentCopy,
    LinkOff,
    LinkRounded,
    SaveOutlined,
    InfoOutlined
} from '@mui/icons-material';
import { DOCKER_MCP_CONFIG, MCPClient } from '../Constants';
import { client } from '../App';
import { MCPClientState } from '../MCPClients';

type Container = {
    Id: string;
    Names: string[];
    Image: string;
    ImageID: string;
    Command: string;
    Created: number;
    Ports: [];
    Labels: {};
    State: string;
    Status: string;
    HostConfig: {
        NetworkMode: string;
    };
    NetworkSettings: {
        Networks: {
            bridge: any;
        }
    },
    Mounts: []
}

const Settings = ({ settings, setSettings, mcpClientStates, onUpdate }: { onUpdate: () => Promise<void>, settings: { showModal: boolean, pollIntervalSeconds: number }, setSettings: (settings: any) => void, mcpClientStates: { [name: string]: MCPClientState } }) => {

    const updateAndSaveSettings = (settings: any) => {
        setSettings(settings);
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    const [buttonsLoading, setButtonsLoading] = useState<{ [name: string]: boolean }>({});

    return (
        <Stack direction="column" spacing={1} justifyContent='center' alignItems='center'>
            {/* MCP Clients Section */}
            <Accordion defaultExpanded sx={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="mcp-clients-content"
                    id="mcp-clients-header"
                >
                    <Typography variant="h6">MCP Clients</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper elevation={0} sx={{ p: 2 }}>
                        <List>
                            {Object.entries(mcpClientStates).map(([name, mcpClientState]) => (
                                <ListItem key={name} secondaryAction={
                                    <Tooltip title="You need to restart Claude Desktop after changing the connection.">
                                        <span>
                                            {mcpClientState.exists && mcpClientState.configured &&
                                                <Button onClick={async () => {
                                                    setButtonsLoading({ ...buttonsLoading, [name]: true });
                                                    await mcpClientState.disconnect(client)
                                                    await onUpdate();
                                                    setButtonsLoading({ ...buttonsLoading, [name]: false });
                                                }} disabled={buttonsLoading[name]} color="warning" variant="outlined" size="small">
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
                                                    await mcpClientState.connect(client)
                                                    await onUpdate();
                                                    setButtonsLoading({ ...buttonsLoading, [name]: false });
                                                }} disabled={buttonsLoading[name]} color="primary" variant="outlined" size="small">
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
                                                    await mcpClientState.connect(client)
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
                                }>
                                    <ListItemText
                                        primary={
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="h4">{name}</Typography>
                                                {!mcpClientState.exists && <Chip label='No Config Found' color='error' />}
                                                {mcpClientState.exists && <Chip label={mcpClientState.configured ? 'Connected' : 'Disconnected'} color={mcpClientState.configured ? 'success' : 'error'} />}
                                            </Stack>
                                        }
                                        secondary={
                                            <Stack direction="column" justifyContent="center" spacing={1}>
                                                <Link width="100%" href={mcpClientState.url} target="_blank" rel="noopener noreferrer" onClick={() => client.host.openExternal(mcpClientState.url)}>{mcpClientState.url}</Link>
                                                <Typography sx={{ fontWeight: 'bold' }}>Config Path:</Typography>
                                                <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto', width: '70%', backgroundColor: 'grey.200', padding: 1, borderRadius: 1 }}>{mcpClientState.path}</Typography>
                                            </Stack>
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
                                <IconButton onClick={() => navigator.clipboard.writeText(DOCKER_MCP_CONFIG.command + ' ' + DOCKER_MCP_CONFIG.args.join(' '))}>
                                    <ContentCopy />
                                </IconButton>
                                <Typography variant="caption" sx={theme => ({ backgroundColor: theme.palette.grey[200], padding: 1, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto' })}>
                                    {DOCKER_MCP_CONFIG.command} {DOCKER_MCP_CONFIG.args.join(' ')}
                                </Typography>
                            </Stack>
                        </Alert>

                    </Paper>
                </AccordionDetails>
            </Accordion >

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary>
                    <Typography variant="h6">Registries</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper elevation={0} sx={{ p: 2 }}>
                        <List>
                            <ListItem secondaryAction={
                                <Tooltip title="You can't disconnect the default registry!">
                                    <span>
                                        <Button color="warning" variant="outlined" size="small" disabled={true}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography>Disconnect</Typography>
                                                <LinkOff />
                                            </Stack>
                                        </Button>
                                    </span>
                                </Tooltip>
                            }>
                                <ListItemText primary={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h4"><Link href="https://github.com/docker/labs-ai-tools-for-devs/blob/main/prompts/catalog.yaml" target="_blank" rel="noopener noreferrer" onClick={() => {
                                            client.host.openExternal('https://github.com/docker/labs-ai-tools-for-devs/blob/main/prompts/catalog.yaml');
                                        }}>catalog.yaml</Link></Typography>
                                        <Chip label="Default" color="success" />
                                    </Stack>
                                } />
                            </ListItem>
                        </List>
                        <Divider />
                        <Tooltip title="Coming soon!">
                            <span>
                                <Button disabled={true} variant="contained" color="primary" sx={{ mt: 2 }}>Connect New Registry</Button>
                            </span>
                        </Tooltip>
                    </Paper>
                </AccordionDetails>
            </Accordion>
            {/* Extension Settings Section */}
            < Accordion sx={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="extension-settings-content"
                    id="extension-settings-header"
                >
                    <Typography variant="h6">Extension Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper elevation={0} sx={{ p: 2 }}>
                        <Grid2 container spacing={3}>
                            <Grid2 size={12}>
                                <TextField
                                    fullWidth
                                    label="Polling Interval (seconds)"
                                    type="number"
                                    value={settings.pollIntervalSeconds}
                                    onChange={(e) => updateAndSaveSettings({ ...settings, pollIntervalSeconds: Number(e.target.value) })}
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 1,
                                                max: 300,
                                            }
                                        }
                                    }}
                                />
                            </Grid2>
                        </Grid2>
                    </Paper>
                </AccordionDetails>
            </Accordion >

            {/* Developer Settings Section */}
            < Accordion sx={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="developer-settings-content"
                    id="developer-settings-header"
                >
                    <Typography variant="h6">Developer Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid2 container spacing={3}>
                        <Grid2 size={4}>
                            <Button variant="contained" color="warning" onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}>Reset Local Storage</Button>
                        </Grid2>
                        <Grid2 size={4}>
                            <Button variant="contained" color="primary" onClick={async () => {
                                setButtonsLoading({ ...buttonsLoading, restartService: true });
                                const containers = await client.docker.listContainers() as Container[];
                                console.log(containers);
                                const mcpDockerContainer = containers.find(container => container.Names.includes('/docker_labs-ai-tools-for-devs-desktop-extension-service'));
                                if (mcpDockerContainer) {
                                    try {
                                        await client.docker.cli.exec('restart', [mcpDockerContainer.Id]);
                                    } catch (error) {
                                        console.error(error);
                                        client.desktopUI.toast.error((error as any).stderr);
                                    }
                                }
                                setButtonsLoading({ ...buttonsLoading, restartService: false });
                            }} disabled={buttonsLoading.restartService}>{buttonsLoading.restartService && <CircularProgress sx={{ mr: 1 }} size={16} />} Restart mcp/docker Service</Button>
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion >
        </Stack >
    );
};

export default Settings;