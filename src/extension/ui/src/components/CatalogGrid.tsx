import React, { useEffect, useState } from 'react';
import { Card, CardContent, IconButton, Alert, Stack, Button, Typography, Grid2, Select, MenuItem, FormControl, InputLabel, Switch, FormGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, Checkbox, Badge, BadgeProps, Link, TextField, Tabs, Tab, Tooltip, InputAdornment, CircularProgress } from '@mui/material';
import { CatalogItemWithName, CatalogItemCard, CatalogItem } from './PromptCard';
import AddIcon from '@mui/icons-material/Add';
import { Ref } from '../Refs';
import { v1 } from "@docker/extension-api-client-types";
import { parse, stringify } from 'yaml';
import { getRegistry, syncConfigWithRegistry, syncRegistryWithConfig } from '../Registry';
import { FolderOpenRounded, Search, Settings } from '@mui/icons-material';
import { tryRunImageSync } from '../FileWatcher';
import { CATALOG_URL, DD_BUILD_WITH_SECRET_SUPPORT, MCP_POLICY_NAME, POLL_INTERVAL } from '../Constants';
import { SecretList } from './SecretList';
import Secrets from '../Secrets';
import { ParsedParameters } from './PromptConfig';

interface CatalogGridProps {
    registryItems: { [key: string]: { ref: string, config: any } };
    canRegister: boolean;
    client: v1.DockerDesktopClient;
    onRegistryChange: () => void;
    showSettings: () => void;
    settingsBadgeProps: BadgeProps;
    setConfiguringItem: (item: CatalogItemWithName) => void;
    config: { [key: string]: { [key: string]: ParsedParameters } };
}

const filterCatalog = (catalogItems: CatalogItemWithName[], registryItems: { [key: string]: { ref: string } }, search: string) =>
    catalogItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

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
    registryItems,
    canRegister,
    client,
    onRegistryChange,
    showSettings,
    settingsBadgeProps,
    setConfiguringItem,
    config
}) => {
    const [catalogItems, setCatalogItems] = useState<CatalogItemWithName[]>([]);
    const [showReloadModal, setShowReloadModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [tab, setTab] = useState<number>(0);
    const [secrets, setSecrets] = useState<Secrets.Secret[]>([]);
    const [ddVersion, setDdVersion] = useState<{ version: string, build: number } | null>(null);

    const filteredCatalogItems = filterCatalog(catalogItems, registryItems, search);

    const loadCatalog = async (showNotification = true) => {
        const cachedCatalog = localStorage.getItem('catalog');
        try {
            const response = await fetch(CATALOG_URL);
            const catalog = await response.text();
            const items = parse(catalog)['registry'] as { [key: string]: CatalogItem }
            const itemsWithName = Object.entries(items).map(([name, item]) => ({ name, ...item }));
            const filteredItems = filterCatalog(itemsWithName, registryItems, search);
            setCatalogItems(filteredItems);
            localStorage.setItem('catalog', JSON.stringify(filteredItems));
            if (showNotification) {
                client.desktopUI.toast.success('Catalog updated successfully.');
            }
        }
        catch (error) {
            if (cachedCatalog) {
                setCatalogItems(JSON.parse(cachedCatalog));
            }
            if (showNotification) {
                client.desktopUI.toast.error(`Failed to get latest catalog.${cachedCatalog ? ' Using cached catalog.' : ''}` + error);
            }
        }
    }

    const loadSecrets = async () => {
        const response = await Secrets.getSecrets(client);
        setSecrets(response || []);
    }

    const loadDDVersion = async () => {
        const ddVersionResult = await client.docker.cli.exec('version', ['--format', 'json'])
        setDdVersion(parseDDVersion(JSON.parse(ddVersionResult.stdout).Server.Platform.Name));
    }

    const registerCatalogItem = async (item: CatalogItemWithName, showNotification = true) => {
        try {
            const currentRegistry = await getRegistry(client);
            const newRegistry = { ...currentRegistry, [item.name]: { ref: item.ref } };
            const payload = JSON.stringify({
                files: [{
                    path: 'registry.yaml',
                    content: stringify({ registry: newRegistry })
                }]
            })
            await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
            if (showNotification) {
                client.desktopUI.toast.success('Prompt registered successfully. Restart Claude Desktop to apply.');
            }
            onRegistryChange();
            if (showNotification) {
                setShowReloadModal(!localStorage.getItem(NEVER_SHOW_AGAIN_KEY));
            }
            await syncConfigWithRegistry(client);
            await syncRegistryWithConfig(client);
        }
        catch (error) {
            if (showNotification) {
                client.desktopUI.toast.error('Failed to register prompt: ' + error);
            }
        }
    }

    const unregisterCatalogItem = async (item: CatalogItemWithName) => {
        try {
            const currentRegistry = await getRegistry(client);
            delete currentRegistry[item.name];
            const payload = JSON.stringify({
                files: [{
                    path: 'registry.yaml',
                    content: stringify({ registry: currentRegistry })
                }]
            })
            await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`])
            client.desktopUI.toast.success('Prompt unregistered successfully. Restart Claude Desktop to apply.');
            onRegistryChange();
            setShowReloadModal(!localStorage.getItem(NEVER_SHOW_AGAIN_KEY));
            await syncConfigWithRegistry(client);
            await syncRegistryWithConfig(client);
        }
        catch (error) {
            client.desktopUI.toast.error('Failed to unregister prompt: ' + error)
        }
    }

    useEffect(() => {
        loadCatalog(false);
        loadSecrets();
        loadDDVersion();
        const interval = setInterval(() => {
            loadCatalog(false);
            loadSecrets();
        }, POLL_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const hasOutOfCatalog = catalogItems.length > 0 && Object.keys(registryItems).length > 0 && !Object.keys(registryItems).every((i) =>
        catalogItems.some((c) => c.name === i)
    )

    if (!ddVersion) {
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
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 0, mt: 1 }}>
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
            </FormGroup >

            {tab === 0 && <Grid2 container spacing={1} width='90vw' maxWidth={1000}>
                {filteredCatalogItems.map((catalogItem) => {
                    const expectedProperties = catalogItem.config?.map((c: { name: string, parameters: ParsedParameters }) => Object.keys(c.parameters)).flat() || []
                    const hasAllConfig = !expectedProperties.length || expectedProperties.every((p: string) => config[catalogItem.name]?.[p])
                    return (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={catalogItem.name}>
                            <CatalogItemCard
                                hasAllConfig={hasAllConfig}
                                setConfiguringItem={setConfiguringItem}
                                openUrl={() => {
                                    client.host.openExternal(Ref.fromRef(catalogItem.ref).toURL(true));
                                }}
                                item={catalogItem}
                                ddVersion={ddVersion}
                                canRegister={canRegister}
                                registered={Object.keys(registryItems).some((i) => i === catalogItem.name)}
                                register={registerCatalogItem}
                                unregister={unregisterCatalogItem}
                                onSecretChange={async (secret) => {
                                    await Secrets.addSecret(client, { name: secret.name, value: secret.value, policies: [MCP_POLICY_NAME] })
                                    loadSecrets();
                                }}
                                secrets={secrets}
                            />
                        </Grid2>
                    )
                })}
                <Grid2 size={12}>
                    <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CardContent>
                            <IconButton sx={{ height: '100%' }} onClick={() => {
                                client.host.openExternal('https://vonwig.github.io/prompts.docs/tools/docs/');
                            }}>
                                <AddIcon sx={{ width: '100%', height: 100 }} />
                            </IconButton>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>}
            {tab === 1 && <Grid2 container spacing={1} width='90vw' maxWidth={1000}>
                {Object.entries(registryItems).map(([name, item]) => {
                    const hasAllConfig = item.config?.map((c: any) => c.name).every((c: any) => config[name]?.[c])
                    return (
                        name.toLowerCase().includes(search.toLowerCase()) && <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                            <CatalogItemCard hasAllConfig={hasAllConfig} ddVersion={ddVersion} item={catalogItems.find((i) => i.name === name)!} openUrl={() => {
                                client.host.openExternal(Ref.fromRef(item.ref).toURL(true));
                            }} canRegister={canRegister} registered={true} register={registerCatalogItem} unregister={unregisterCatalogItem} onSecretChange={async (secret) => {
                                await Secrets.addSecret(client, { name: secret.name, value: secret.value, policies: [MCP_POLICY_NAME] })
                                loadSecrets();
                            }} secrets={secrets} setConfiguringItem={setConfiguringItem} />
                        </Grid2>
                    )
                })}
            </Grid2>}
            {tab === 2 && ddVersion && <SecretList secrets={secrets} ddVersion={ddVersion} />}
        </Stack >
    );
};
