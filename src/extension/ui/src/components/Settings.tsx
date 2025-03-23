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
    AlertTitle,
    Drawer,
    ListItemIcon,
    ListItemButton
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ContentCopy,
    LinkOff,
    LinkRounded,
    SaveOutlined,
    InfoOutlined,
    DatasetLinked,
    Style,
    SettingsApplications,
    IntegrationInstructions
} from '@mui/icons-material';
import { client } from '../App';
import { MCPClientState } from '../MCPClients';
import { DOCKER_MCP_COMMAND } from '../Constants';

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

const MCPClientSettings = ({ mcpClientStates, onUpdate, setButtonsLoading, buttonsLoading }: { mcpClientStates: { [name: string]: MCPClientState }, onUpdate: () => Promise<void>, setButtonsLoading: (buttonsLoading: { [name: string]: boolean }) => void, buttonsLoading: { [name: string]: boolean } }) => <Box sx={{ width: '100%' }}>

    <Typography variant="h6">MCP Clients</Typography>

    <List sx={{ p: 0 }}>
        {Object.entries(mcpClientStates).map(([name, mcpClientState]) => (
            <ListItem key={name}>
                <ListItemText
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
                        <Stack direction="column" justifyContent="center" spacing={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Link href={mcpClientState.client.url} target="_blank" rel="noopener noreferrer" onClick={() => client.host.openExternal(mcpClientState.client.url)}>{mcpClientState.client.url}</Link>
                            </Stack>
                            <Typography sx={{ fontWeight: 'bold' }}>Expected Config Path:</Typography>
                            <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto', maxWidth: '80%', backgroundColor: 'grey.200', padding: 1, borderRadius: 1, fontSize: '12px' }}>
                                {mcpClientState.client.expectedConfigPath[client.host.platform as 'win32' | 'darwin' | 'linux']}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>Manually Configure:</Typography>
                            <List sx={{ listStyleType: 'decimal', p: 0, pl: 2 }}>
                                {mcpClientState.client.manualConfigSteps.map((step, index) => (
                                    <ListItem sx={{ display: 'list-item', p: 0 }} key={index}>
                                        <ListItemText primary={<div dangerouslySetInnerHTML={{ __html: step }} />} />
                                    </ListItem>
                                ))}
                            </List>
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
            <IconButton onClick={() => navigator.clipboard.writeText(DOCKER_MCP_COMMAND)}>
                <ContentCopy />
            </IconButton>
            <Typography variant="caption" sx={theme => ({ backgroundColor: theme.palette.grey[200], padding: 1, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto' })}>
                {DOCKER_MCP_COMMAND}
            </Typography>
        </Stack>
    </Alert>
</Box >

const Settings = ({ settings, setSettings, mcpClientStates, onUpdate }: { onUpdate: () => Promise<void>, settings: { showModal: boolean, pollIntervalSeconds: number }, setSettings: (settings: any) => void, mcpClientStates: { [name: string]: MCPClientState } }) => {

    const [navTab, setNavTab] = useState<'mcp-clients' | 'registries' | 'extension-settings' | 'developer-settings'>('mcp-clients');
    const updateAndSaveSettings = (settings: any) => {
        setSettings(settings);
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    const [buttonsLoading, setButtonsLoading] = useState<{ [name: string]: boolean }>({});

    const listItemButtonSx = {
        height: '48px',
        maxHeight: '48px',
        border: '1px solid',
        borderRadius: '0px',
        borderColor: 'divider',
        borderRight: 'none',
        borderLeft: 'none',
        '&.active': {
            backgroundColor: 'primary.main',
            color: 'white',
            '& .MuiListItemIcon-root': {
                color: 'white !important',
            },
            '& .MuiListItemText-primary': {
                color: 'white !important',

                fontWeight: 'bold',
            },
        },
    }

    return (
        <Stack direction="row" spacing={1} justifyContent='center' sx={{ minHeight: '90vh', p: 0 }}>
            <List sx={{ width: '200px', backgroundColor: 'background.paper' }}>
                <ListItemButton className={navTab === 'mcp-clients' ? 'active' : ''} sx={listItemButtonSx} onClick={() => setNavTab('mcp-clients')}>
                    <ListItemIcon>
                        <DatasetLinked />
                    </ListItemIcon>
                    <ListItemText primary="MCP Clients" />
                </ListItemButton>
                <ListItemButton className={navTab === 'registries' ? 'active' : ''} sx={listItemButtonSx} onClick={() => setNavTab('registries')}>
                    <ListItemIcon>
                        <Style />
                    </ListItemIcon>
                    <ListItemText primary="Registries" />
                </ListItemButton>
                <ListItemButton className={navTab === 'extension-settings' ? 'active' : ''} sx={listItemButtonSx} onClick={() => setNavTab('extension-settings')} >
                    <ListItemIcon>
                        <SettingsApplications />
                    </ListItemIcon>
                    <ListItemText primary="Extension Settings" />
                </ListItemButton>
                <ListItemButton className={navTab === 'developer-settings' ? 'active' : ''} sx={listItemButtonSx} onClick={() => setNavTab('developer-settings')}>
                    <ListItemIcon>
                        <IntegrationInstructions />
                    </ListItemIcon>
                    <ListItemText primary="Developer Settings" />
                </ListItemButton>
            </List>
            {/* MCP Clients Section */}
            {navTab === 'mcp-clients' && <MCPClientSettings mcpClientStates={mcpClientStates} onUpdate={onUpdate} setButtonsLoading={setButtonsLoading} buttonsLoading={buttonsLoading} />}


            {
                navTab === 'registries' && <Box sx={{ width: '100%' }}>
                    <Typography variant="h6">Registries</Typography>
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
                </Box>
            }
            {/* Extension Settings Section */}
            {
                navTab === 'extension-settings' && <Box sx={{ width: '100%' }}>

                    <Typography variant="h6">Extension Settings</Typography>

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
                </Box>
            }

            {/* Developer Settings Section */}
            {
                navTab === 'developer-settings' && <Box sx={{ width: '100%' }}>
                    <Typography variant="h6">Developer Settings</Typography>
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
                </Box>
            }
        </Stack >
    );
};

export default Settings;