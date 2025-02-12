import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, IconButton, CircularProgress, Alert, Stack, Button, Typography } from '@mui/material';
import { CatalogItemWithName, CatalogItemCard, CatalogItem } from './PromptCard';
import AddIcon from '@mui/icons-material/Add';
import { Ref } from '../Refs';
import { v1 } from "@docker/extension-api-client-types";
import { parse, stringify } from 'yaml';
import { getRegistry } from '../Registry';
import { FolderOpenRounded } from '@mui/icons-material';
import { tryRunImageSync } from '../FileWatcher';

interface CatalogGridProps {
    registryItems: { [key: string]: { ref: string } };
    canRegister: boolean;
    client: v1.DockerDesktopClient;
    onRegistryChange: () => void;
}

const CATALOG_URL = 'https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml'


export const CatalogGrid: React.FC<CatalogGridProps> = ({
    registryItems,
    canRegister,
    client,
    onRegistryChange,
}) => {
    const [catalogItems, setCatalogItems] = useState<CatalogItemWithName[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadCatalog = async (showNotification = true) => {
        const cachedCatalog = localStorage.getItem('catalog');
        try {
            const response = await fetch(CATALOG_URL);
            const catalog = await response.text();
            const items = parse(catalog)['registry'] as { [key: string]: CatalogItem }
            const itemsWithName = Object.entries(items).map(([name, item]) => ({ name, ...item }));
            setCatalogItems(itemsWithName);
            localStorage.setItem('catalog', JSON.stringify(itemsWithName));
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

    const registerCatalogItem = async (item: CatalogItemWithName) => {
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
            client.desktopUI.toast.success('Prompt registered successfully. Restart Claude Desktop to apply.');
            onRegistryChange();

        }
        catch (error) {
            client.desktopUI.toast.error('Failed to register prompt: ' + error);
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
        }
        catch (error) {
            client.desktopUI.toast.error('Failed to unregister prompt: ' + error)
        }
    }

    useEffect(() => {
        const interval = setInterval(loadCatalog, 1000 * 30);
        loadCatalog(false);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const hasOutOfCatalog = catalogItems.length > 0 && Object.keys(registryItems).length > 0 && !Object.keys(registryItems).every((i) =>
        catalogItems.some((c) => c.name === i)
    )

    return (
        <Stack spacing={2}>
            {hasOutOfCatalog && <Alert action={<Button startIcon={<FolderOpenRounded />} variant='outlined' color='secondary' onClick={() => {
                client.desktopUI.navigate.viewVolume('docker-prompts')
            }}>registry.yaml</Button>} severity="info">
                <Typography sx={{ width: '100%' }}>You have some prompts registered which are not available in the catalog.</Typography>
            </Alert>}
            <Grid container spacing={2}>
                {catalogItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.name} flex="1 1 0">
                        <CatalogItemCard
                            openUrl={() => {
                                client.host.openExternal(Ref.fromRef(item.ref).toURL(true));
                            }}
                            item={item}
                            canRegister={canRegister}
                            registered={Object.keys(registryItems).some((i) => i === item.name)}
                            register={registerCatalogItem}
                            unregister={unregisterCatalogItem}
                        />
                    </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4} flex="1 1 0">
                    <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CardContent>
                            <IconButton sx={{ height: '100%' }} onClick={() => {
                                client.host.openExternal('https://vonwig.github.io/prompts.docs/tools/docs/');
                            }}>
                                <AddIcon sx={{ width: '100%', height: 100 }} />
                            </IconButton>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
};
