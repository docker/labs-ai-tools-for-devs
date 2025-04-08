import React from 'react';
import { Alert, AlertTitle, Grid2 } from '@mui/material';
import Tile from '../tile/Index';
import { MCP_POLICY_NAME } from '../../Constants';
import TileActions from '../tile/Bottom';
import { v1 } from '@docker/extension-api-client-types';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { CatalogItemWithName } from '../../types/catalog';
import { Secret } from '../../types/secrets';
// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

interface YourToolsProps {
    search: string;
    registryItems: { [key: string]: { ref: string, config: any } };
    config: { [key: string]: { [key: string]: any } };
    canRegister: boolean;
    unregister: (item: CatalogItemWithName) => Promise<void>;
    setConfiguringItem: (item: CatalogItemWithName) => void;
    secrets: Secret[];
    catalogItems: CatalogItemWithName[];
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    ddVersion: { version: string, build: number };
}

const YourTools: React.FC<YourToolsProps> = ({
    search,
    registryItems,
    catalogItems,
    ddVersion,
    canRegister,
    setConfiguringItem,
    secrets,
    unregister,
    onSecretChange,
    config
}) => {
    return (
        <Grid2 container spacing={1} width='90vw' maxWidth={1000}>
            {Object.entries(registryItems).map(([name, item]) => {
                if (!name.toLowerCase().includes(search.toLowerCase())) return null;
                const catalogItem = catalogItems.find(c => c.name === name);
                const unassignedConfig = catalogItem?.config?.filter((c: any) => !config[name]?.[c]) || [];
                const unassignedSecrets = catalogItem?.secrets?.filter((s: any) => !secrets.find((s: any) => s.name === s)) || [];
                if (!catalogItem) return <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                    <Alert severity="error">
                        <AlertTitle><strong>{name}</strong> not in catalog</AlertTitle>
                        You have registered a tile named <strong>{name}</strong> but it is not in the catalog. If this is not intentional, the catalog may have changed since.
                    </Alert>
                </Grid2>;
                return (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                        <Tile
                            item={catalogItem}
                            registered={true}
                            onSecretChange={async () => { }}
                            secrets={secrets}
                            ActionsSlot={<TileActions
                                setConfiguringItem={setConfiguringItem}
                                item={catalogItem}
                                ddVersion={ddVersion}
                                registered={true}
                                register={() => Promise.resolve()}
                                unregister={unregister}
                                onSecretChange={onSecretChange}
                                secrets={secrets}
                                canRegister={canRegister}
                                unAssignedConfig={[]}
                            />}
                        />
                    </Grid2>
                );
            })}
        </Grid2>
    );
};

export default YourTools; 