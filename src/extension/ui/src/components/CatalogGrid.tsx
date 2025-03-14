import React, { Suspense, useEffect, useState } from 'react';
import { IconButton, Alert, Stack, Button, Typography, FormGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, Checkbox, Badge, BadgeProps, Link, TextField, Tabs, Tab, Tooltip, CircularProgress, Box } from '@mui/material';
import { CatalogItemWithName } from './tile/Tile';
import { FolderOpenRounded, Search, Settings } from '@mui/icons-material';
import { useCatalogContext } from '../context/CatalogContext';
import { createDockerDesktopClient } from '@docker/extension-api-client';

const ToolCatalog = React.lazy(() => import('./tabs/ToolCatalog'));
const YourTools = React.lazy(() => import('./tabs/YourTools'));
const YourEnvironment = React.lazy(() => import('./tabs/YourEnvironment'));

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

interface CatalogGridProps {
    showSettings: () => void;
    settingsBadgeProps: BadgeProps;
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
    showSettings,
    settingsBadgeProps,
    setConfiguringItem,
}) => {
    const {
        catalogItems,
        registryItems,
        canRegister,
        config,
        registerCatalogItem,
        unregisterCatalogItem,
        tryLoadSecrets,
        secrets
    } = useCatalogContext();

    if (!registryItems) {
        return <CircularProgress />
    }

    const [showReloadModal, setShowReloadModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [tab, setTab] = useState<number>(0);
    const [ddVersion, setDdVersion] = useState<{ version: string, build: number } | null>(null);

    const loadDDVersion = async () => {
        const ddVersionResult = await client.docker.cli.exec('version', ['--format', 'json'])
        setDdVersion(parseDDVersion(JSON.parse(ddVersionResult.stdout).Server.Platform.Name));
    }

    useEffect(() => {
        loadDDVersion();
    }, []);

    const hasOutOfCatalog = catalogItems.length > 0 && Object.keys(registryItems).length > 0 && !Object.keys(registryItems).every((i) =>
        catalogItems.some((c) => c.name === i)
    )

    if (!ddVersion) {
        return <CircularProgress />
    }


    if (!config) {
        return <CircularProgress />
    }

    return (
        <Stack spacing={2} justifyContent='center' alignItems='center'>
            <Dialog open={showReloadModal} onClose={() => setShowReloadModal(false)}>
                <DialogTitle>Registry Updated</DialogTitle>
                <DialogContent>
                    <Typography sx={{ marginBottom: 2 }}>
                        You have updated the registry.
                        Use the keybind {client.host.platform === 'win32' ? 'Ctrl' : '⌘'} + R to refresh MCP servers in Claude Desktop.
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Button onClick={() => {
                            setShowReloadModal(false)
                        }}>Close</Button>
                        <FormControlLabel control={<Checkbox defaultChecked={Boolean(localStorage.getItem(NEVER_SHOW_AGAIN_KEY))} onChange={(e) => localStorage.setItem(NEVER_SHOW_AGAIN_KEY, e.target.checked.toString())} />} label="Don't show this again" />
                    </Stack>
                </DialogContent>
            </Dialog>
            {hasOutOfCatalog && <Alert action={<Button startIcon={<FolderOpenRounded />} variant='outlined' color='secondary' onClick={() => {
                client.desktopUI.navigate.viewVolume('docker-prompts')
            }}>registry.yaml</Button>} severity="info">
                <Typography sx={{ width: '100%' }}>You have some prompts registered which are not available in the catalog.</Typography>
            </Alert>}
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ width: '100%' }}>
                <Tooltip title="These are all of the tiles you have available across the catalog.">
                    <Tab sx={{ fontSize: '1.5em' }} label="Tool Catalog" />
                </Tooltip>
                <Tooltip title="These are tiles which you have allowed MCP clients to use.">
                    <Tab sx={{ fontSize: '1.5em' }} label="Your Tools" />
                </Tooltip>
                <Tooltip title="These are environment variables and secrets which you have set for your MCP clients.">
                    <Tab sx={{ fontSize: '1.5em' }} label="Your Environment" />
                </Tooltip>
            </Tabs>
            <FormGroup sx={{ width: '100%', mt: 0 }}>
                <Stack direction="row" spacing={1} alignItems='center' justifyContent="space-evenly">
                    <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Link sx={{ fontWeight: 'bold', justifySelf: 'flex-end', marginLeft: 'auto', }} href="https://vonwig.github.io/prompts.docs/tools/docs/" target="_blank" rel="noopener noreferrer" onClick={() => {
                        client.host.openExternal('https://vonwig.github.io/prompts.docs/tools/docs/');
                    }}>⇱ Documentation</Link>
                    <Link sx={{ fontWeight: 'bold', }} href="https://github.com/docker/labs-ai-tools-for-devs" target="_blank" rel="noopener noreferrer" onClick={() => {
                        client.host.openExternal('https://github.com/docker/labs-ai-tools-for-devs');
                    }}>⇱ GitHub</Link>
                    <IconButton sx={{ ml: 2, alignSelf: 'flex-end', justifyContent: 'flex-end' }} onClick={showSettings}>
                        <Badge {...settingsBadgeProps}>
                            <Settings sx={{ fontSize: '1.5em' }} />
                        </Badge>
                    </IconButton>
                </Stack>
            </FormGroup>

            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
                {tab === 0 && (
                    <ToolCatalog
                        registryItems={registryItems}
                        config={config}
                        search={search}
                        catalogItems={catalogItems}
                        client={client}
                        ddVersion={ddVersion}
                        canRegister={canRegister}
                        register={registerCatalogItem}
                        unregister={unregisterCatalogItem}
                        onSecretChange={tryLoadSecrets}
                        secrets={secrets}
                        setConfiguringItem={setConfiguringItem}
                    />
                )}
                {tab === 1 && (
                    <YourTools
                        search={search}
                        registryItems={registryItems}
                        config={config}
                        ddVersion={ddVersion}
                        canRegister={canRegister}
                        setConfiguringItem={setConfiguringItem}
                        secrets={secrets}
                    />
                )}
                {tab === 2 && ddVersion && (
                    <YourEnvironment
                        secrets={secrets}
                        ddVersion={ddVersion}
                        config={config}
                    />
                )}
            </Suspense>
        </Stack>
    );
};
