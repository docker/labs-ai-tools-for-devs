import React, { Suspense, useEffect, useState } from 'react';
import { IconButton, Alert, AlertTitle, Stack, Button, Typography, FormGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, Checkbox, Badge, TextField, Tabs, Tab, CircularProgress, Box, Menu, Divider, Switch, MenuItem } from '@mui/material';
import { SwapVert, FolderOpenRounded } from '@mui/icons-material';
import { useCatalogContext } from '../context/CatalogContext';
import { useMCPClientContext } from '../context/MCPClientContext';
import { useConfigContext } from '../context/ConfigContext';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';
import YourClients from './tabs/YourClients';
import { CatalogItemWithName } from '../types/catalog';
import { CATALOG_LAYOUT_SX } from '../Constants';

const ToolCatalog = React.lazy(() => import('./tabs/ToolCatalog'));
const YourEnvironment = React.lazy(() => import('./tabs/YourEnvironment'));

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

interface CatalogGridProps {
    showSettings: () => void;
    setConfiguringItem: (item: CatalogItemWithName) => void;
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
    setConfiguringItem,
}) => {
    const {
        catalogItems,
        registryItems,
        canRegister,
        registerCatalogItem,
        unregisterCatalogItem,
        tryUpdateSecrets,
        secrets
    } = useCatalogContext();

    const {
        mcpClientStates,
        isLoading: mcpLoading
    } = useMCPClientContext();

    const {
        config
    } = useConfigContext();

    const [showReloadModal, setShowReloadModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [tab, setTab] = useState<number>(0);
    const [ddVersion, setDdVersion] = useState<{ version: string, build: number } | null>(null);
    const [openMenus, setOpenMenus] = useState<{ [key: string]: { anchorEl: HTMLElement | null, open: boolean } }>({
        'demo-customized-menu': { anchorEl: null, open: false }
    });

    const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'date-asc' | 'date-desc'>('date-desc');
    const [showMine, setShowMine] = useState<boolean>(localStorage.getItem('showMine') === 'true');

    const loadDDVersion = async () => {
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
    }

    useEffect(() => {
        loadDDVersion();
    }, []);


    if (!registryItems) {
        return <>
            <CircularProgress />
            <Typography>Loading registry...</Typography>
        </>
    }

    const hasOutOfCatalog = catalogItems.length > 0 && Object.keys(registryItems).length > 0 && !Object.keys(registryItems).every((i) =>
        catalogItems.some((c) => c.name === i)
    )

    const sortedCatalogItems = sort !== 'date-desc' ? [...catalogItems].sort((a, b) => {
        if (sort === 'name-asc') {
            return a.name.localeCompare(b.name);
        }
        if (sort === 'name-desc') {
            return b.name.localeCompare(a.name);
        }
        return 0;
    }) : catalogItems;

    if (!ddVersion) {
        return <>
            <CircularProgress />
            <Typography>Loading Docker Desktop version...</Typography>
        </>
    }

    const noConfiguredClients = !mcpLoading && !Object.values(mcpClientStates || {}).some(state => state.exists && state.configured);

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
                                    <TextField label="Search" sx={{ width: 380 }} value={search} onChange={(e) => setSearch(e.target.value)} />
                                    <IconButton
                                        id="demo-customized-button"
                                        aria-controls={openMenus['demo-customized-menu'] ? 'demo-customized-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openMenus['demo-customized-menu'] ? 'true' : undefined}
                                        onClick={(e) => setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: e.currentTarget, open: !openMenus['demo-customized-menu'].open } })}
                                    >
                                        <SwapVert />
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
                                {/* <MenuItem onClick={() => setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: null, open: false } })} disableRipple>
                            ️‍🔥 Trending
                        </MenuItem>
                        <MenuItem onClick={() => setOpenMenus({ ...openMenus, 'demo-customized-menu': { anchorEl: null, open: false } })} disableRipple>
                            ⬇️ Most Downloads
                        </MenuItem> */}
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
                            registryItems={registryItems}
                            search={search}
                            catalogItems={sortedCatalogItems}
                            showMine={showMine}
                            client={client}
                            ddVersion={ddVersion}
                            canRegister={canRegister}
                            register={registerCatalogItem}
                            unregister={unregisterCatalogItem}
                            onSecretChange={tryUpdateSecrets}
                            secrets={secrets}
                            setConfiguringItem={setConfiguringItem}
                            config={config || {}}
                        />
                    )}
                    {/* {tab === 1 && (
                    <YourTools
                        registryItems={registryItems}
                        search={search}
                        catalogItems={sortedCatalogItems}
                        unregister={unregisterCatalogItem}
                        onSecretChange={tryLoadSecrets}
                        secrets={secrets}
                        setConfiguringItem={setConfiguringItem}
                        canRegister={canRegister}
                        ddVersion={ddVersion}
                        config={config || {}}
                    />
                )} */}
                    {tab === 2 && ddVersion && (
                        <YourEnvironment
                            secrets={secrets}
                            ddVersion={ddVersion}
                            config={config || {}}
                        />
                    )}
                    {tab === 1 && (
                        <YourClients
                            client={client}
                        />
                    )}
                </Suspense>
            </Stack>
        </>
    );
};
