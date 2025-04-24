import { createDockerDesktopClient } from '@docker/extension-api-client';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';
import FolderOpenRounded from '@mui/icons-material/FolderOpenRounded';
import SwapVert from '@mui/icons-material/SwapVert';
import { Alert, AlertTitle, Badge, Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Menu, MenuItem, OutlinedInput, Stack, Switch, Tab, Tabs, Typography } from '@mui/material';
import React, { Suspense, useEffect, useState, useCallback, useMemo } from 'react';

import { CATALOG_LAYOUT_SX } from '../Constants';
import { MCPClientState } from '../MCPClients';
import { CatalogItemRichened } from '../types/catalog';
import YourClients from './tabs/YourClients';

const ToolCatalog = React.lazy(() => import('./tabs/ToolCatalog'));

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

interface CatalogGridProps {
    appProps: any; // We'll use this to pass all our hook data
}

const parseDDVersion = (ddVersion: string) => {
    //eg: Docker Desktop 4.40.0 (184396)
    const [, , version, build] = ddVersion.split(' ');
    return {
        version,
        build: parseInt(build.replace('(', '').replace(')', ''))
    }
}
const NEVER_SHOW_AGAIN_KEY = 'registry-sync-never-show-again';

export const CatalogGrid: React.FC<CatalogGridProps> = ({
    appProps,
}) => {
    // Extract all the values we need from appProps
    const {
        catalogItems,
        registryItems,
        mcpClientStates,
        isLoading: mcpLoading,
    } = appProps;

    const [showReloadModal, setShowReloadModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [tab, setTab] = useState<number>(0);
    const [ddVersion, setDdVersion] = useState<{ version: string, build: number } | null>(null);
    const [showMine, setShowMine] = useState<boolean>(localStorage.getItem('showMine') === 'true');
    const [openMenus, setOpenMenus] = useState<{ [key: string]: { anchorEl: HTMLElement | null, open: boolean } }>({
        'demo-customized-menu': { anchorEl: null, open: false }
    });
    const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'date-desc'>('date-desc');

    const loadDDVersion = useCallback(async () => {
        try {
            const ddVersionResult = await client.docker.cli.exec('version', ['--format', 'json'])
            setDdVersion(parseDDVersion(JSON.parse(ddVersionResult.stdout).Server.Platform.Name));
        } catch (error) {
            if ((error as ExecResult).stderr) {
                client.desktopUI.toast.error('Error loading Docker Desktop version: ' + (error as ExecResult).stderr);
            }
            else {
                client.desktopUI.toast.error('Error loading Docker Desktop version: ' + (error as Error).message);
            }
        }
    }, []);

    useEffect(() => {
        loadDDVersion();
    }, [loadDDVersion]);

    // Only calculate hasOutOfCatalog when relevant data changes
    const hasOutOfCatalog = useMemo(() => {
        if (!catalogItems.length || !registryItems || !Object.keys(registryItems).length) {
            return false;
        }
        return !Object.keys(registryItems).every((i) =>
            catalogItems.some((c: CatalogItemRichened) => c.name === i)
        );
    }, [catalogItems, registryItems]);

    if (!registryItems) {
        return <>
            <CircularProgress />
            <Typography>Loading registry...</Typography>
        </>
    }

    if (!ddVersion) {
        return <>
            <CircularProgress />
            <Typography>Loading Docker Desktop version...</Typography>
        </>
    }

    // Check if there are any configured clients
    const noConfiguredClients = !mcpLoading && mcpClientStates ?
        !Object.values(mcpClientStates as Record<string, MCPClientState>).some(state =>
            state.exists && state.configured
        ) : false;

    return (
        <>
            <Dialog open={showReloadModal} onClose={() => setShowReloadModal(false)}>
                <DialogTitle>Registry Updated</DialogTitle>
                <DialogContent>
                    <Typography sx={{ marginBottom: 2 }}>
                        You have updated the registry. Please refresh your MCP clients so that they get the new tools.
                        <Alert severity="info">
                            <AlertTitle>Claude Desktop</AlertTitle>
                            Use the keybind {client.host.platform === 'win32' ? 'Ctrl' : '⌘'} + R to refresh MCP servers in Claude Desktop.
                        </Alert>
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Button onClick={() => {
                            setShowReloadModal(false)
                        }}>Close</Button>
                        <FormControlLabel control={<Checkbox defaultChecked={Boolean(localStorage.getItem(NEVER_SHOW_AGAIN_KEY))} onChange={(e) => localStorage.setItem(NEVER_SHOW_AGAIN_KEY, e.target.checked.toString())} />} label="Don't show this again" />
                    </Stack>
                </DialogContent>
            </Dialog>
            <Stack spacing={2} justifyContent='center' alignItems='center'>
                <Stack direction="column" spacing={1} justifyContent='center' sx={CATALOG_LAYOUT_SX}>
                    <Typography variant='h3'>AI Tool Catalog</Typography>
                    <Typography variant='caption'>Discover and use open AI tools for your agents on Docker</Typography>
                </Stack>
                {hasOutOfCatalog && <Alert action={<Button startIcon={<FolderOpenRounded />} variant='outlined' color='secondary' onClick={() => {
                    client.desktopUI.navigate.viewVolume('docker-prompts')
                }}>registry.yaml</Button>} severity="info">
                    <Typography sx={{ width: '100%' }}>You have some prompts registered which are not available in the catalog.</Typography>
                </Alert>}
                <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'background.default' }}>
                    <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={CATALOG_LAYOUT_SX}>
                        <Tab label="Tools" />
                        <Tab label={<Badge variant='dot' invisible={!noConfiguredClients} badgeContent={"TEST"} color="error">
                            Clients
                        </Badge>} />
                    </Tabs>
                    {
                        tab === 0 && <Stack direction="row" spacing={1} alignItems='center' sx={{ mt: 1, py: 1, ...CATALOG_LAYOUT_SX }}>
                            <FormGroup>
                                <Stack direction="row" spacing={1} alignItems='center' justifyContent="space-evenly">
                                    <OutlinedInput size="small" type="search" placeholder="Search" sx={{ width: 380 }} value={search} onChange={(e) => setSearch(e.target.value)} />
                                    <IconButton
                                        size="small"
                                        id="demo-customized-button"
                                        aria-controls={openMenus['demo-customized-menu'] ? 'demo-customized-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openMenus['demo-customized-menu'] ? 'true' : undefined}
                                        onClick={(e) => setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: e.currentTarget, open: !openMenus['demo-customized-menu'].open } })}
                                    >
                                        <SwapVert fontSize="small" />
                                    </IconButton>
                                    <FormControlLabel control={<Switch checked={showMine} onChange={(e) => {
                                        setShowMine(e.target.checked)
                                        localStorage.setItem('showMine', e.target.checked.toString())
                                    }} />} label="Show only enabled tools" />
                                </Stack>
                            </FormGroup>

                            <Menu
                                id="demo-customized-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                anchorEl={openMenus['demo-customized-menu'].anchorEl || undefined}
                                open={openMenus['demo-customized-menu'].open}
                                onClose={() => setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: null, open: false } })}
                            >
                                <MenuItem sx={{ fontWeight: sort === 'date-desc' ? 'bold' : 'normal' }} onClick={() => {
                                    setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: null, open: false } })
                                    setSort('date-desc')
                                }} disableRipple>
                                    ⏰ Most Recent
                                </MenuItem>
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem sx={{ fontWeight: sort === 'name-asc' ? 'bold' : 'normal' }} onClick={() => {
                                    setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: null, open: false } })
                                    setSort('name-asc')
                                }} disableRipple>
                                    Name (A-Z)
                                </MenuItem>
                                <MenuItem sx={{ fontWeight: sort === 'name-desc' ? 'bold' : 'normal' }} onClick={() => {
                                    setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: null, open: false } })
                                    setSort('name-desc')
                                }} disableRipple>
                                    Name (Z-A)
                                </MenuItem>
                            </Menu>
                        </Stack>
                    }

                </Box>
                <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
                    {tab === 0 && (
                        <ToolCatalog
                            search={search}
                            showMine={showMine}
                            client={client}
                            sort={sort}
                        />
                    )}
                    {tab === 1 && (
                        <YourClients
                            appProps={appProps}
                        />
                    )}
                </Suspense>
            </Stack>
        </>
    );
}
