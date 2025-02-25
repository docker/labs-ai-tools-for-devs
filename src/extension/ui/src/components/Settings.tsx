import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Card,
    CardContent,
    Stack,
    Grid2,
    ListItemIcon,
    ButtonGroup,
    Link
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Info as InfoIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ContentCopy,
    RemoveCircleOutline,
    ConnectWithoutContact,
    LinkOff,
    LinkRounded,
    Delete
} from '@mui/icons-material';
import { DOCKER_MCP_CONFIG, MCPClient } from '../Constants';
import { client } from '../App';

const Settings = ({ settings, setSettings, mcpClientStates }: { settings: { showModal: boolean, pollIntervalSeconds: number }, setSettings: (settings: any) => void, mcpClientStates: { [name: string]: { exists: boolean, configured: boolean, error?: string } } }) => {

    const updateAndSaveSettings = (settings: any) => {
        setSettings(settings);
        localStorage.setItem('settings', JSON.stringify(settings));
    }

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
                            {Object.entries(mcpClientStates).map(([name, state]) => (
                                <ListItem key={name} secondaryAction={
                                    <>
                                        {state.exists && state.configured &&
                                            <Button color="warning" variant="outlined" size="small">
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography>Disconnect</Typography>
                                                    <LinkOff />
                                                </Stack>
                                            </Button>
                                        }
                                        {state.exists && !state.configured &&
                                            <Button color="primary" variant="outlined" size="small">
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography>Connect</Typography>
                                                    <LinkRounded />
                                                </Stack>
                                            </Button>
                                        }
                                        {!state.exists &&
                                            <Button color="error" variant="outlined" size="small">
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography>Write Config</Typography>
                                                    <SaveIcon />
                                                </Stack>
                                            </Button>
                                        }
                                    </>
                                }>
                                    <ListItemText primary={<Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h4">{name}</Typography>
                                        {!state.exists && <Chip label='No Config Found' color='error' />}
                                        {state.exists && <Chip label={state.configured ? 'Connected' : 'Disconnected'} color={state.configured ? 'success' : 'error'} />}
                                    </Stack>} />
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1} sx={{ mt: 2 }}>
                            <IconButton onClick={() => navigator.clipboard.writeText(DOCKER_MCP_CONFIG.command + ' ' + DOCKER_MCP_CONFIG.args.join(' '))}>
                                <ContentCopy />
                            </IconButton>
                            <Typography variant="caption" sx={theme => ({ backgroundColor: theme.palette.grey[200], padding: 1, borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'auto' })}>
                                {DOCKER_MCP_CONFIG.command} {DOCKER_MCP_CONFIG.args.join(' ')}
                            </Typography>
                        </Stack>
                    </Paper>
                </AccordionDetails>
            </Accordion >

            <Accordion defaultExpanded sx={{ width: '100%' }}>
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
            < Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="developer-settings-content"
                    id="developer-settings-header"
                >
                    <Typography variant="h6">Developer Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper elevation={0} sx={{ p: 2 }}>
                        <Grid2 container spacing={3}>

                        </Grid2>
                    </Paper>
                </AccordionDetails>
            </Accordion >
        </Stack >
    );
};

export default Settings;