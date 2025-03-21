import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    TextField,
    Button,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    Chip,
    Stack,
    Grid2,
    Link,
    CircularProgress,
    ListItemIcon,
    ListItemButton
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    LinkOff,
    DatasetLinked,
    Style,
    SettingsApplications,
    IntegrationInstructions
} from '@mui/icons-material';
import { client } from '../App';
import { useMCPClientContext } from '../context/MCPClientContext';
import YourClients from './tabs/YourClients';

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

const Settings = ({ settings, setSettings }: { settings: { showModal: boolean, pollIntervalSeconds: number }, setSettings: (settings: any) => void }) => {

    const [navTab, setNavTab] = useState<'catalogs' | 'extension-settings' | 'developer-settings'>('catalogs');
    const updateAndSaveSettings = (settings: any) => {
        setSettings(settings);
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    // Get MCP client context
    const { buttonsLoading, setButtonsLoading } = useMCPClientContext();

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
                <ListItemButton className={navTab === 'catalogs' ? 'active' : ''} sx={listItemButtonSx} onClick={() => setNavTab('catalogs')}>
                    <ListItemIcon>
                        <Style />
                    </ListItemIcon>
                    <ListItemText primary="Catalog Sources" />
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

            {
                navTab === 'catalogs' && <Box sx={{ width: '100%' }}>
                    <Typography variant="h6">Catalog Sources</Typography>
                    <List>
                        <ListItem secondaryAction={
                            <Tooltip title="You can't disconnect the default catalog source.">
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