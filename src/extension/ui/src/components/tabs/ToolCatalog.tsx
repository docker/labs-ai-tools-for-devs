import React from 'react';
import { Card, CardContent, Grid2, IconButton } from '@mui/material';
import Tile from '../tile/Index';
import AddIcon from '@mui/icons-material/Add';
import { v1 } from "@docker/extension-api-client-types";
import { CatalogItemWithName } from '../../types/catalog';
import { Secret } from '../../types/secrets';
import { useCatalogContext } from '../../context/CatalogContext';
import { CATALOG_LAYOUT_SX } from '../../Constants';

interface ToolCatalogProps {
    search: string;
    catalogItems: CatalogItemWithName[];
    client: v1.DockerDesktopClient;
    ddVersion: { version: string, build: number };
    canRegister: boolean;
    register: (item: CatalogItemWithName) => Promise<void>;
    unregister: (item: CatalogItemWithName) => Promise<void>;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secret[];
    registryItems: { [key: string]: { ref: string, config: any } };
    setConfiguringItem: (item: CatalogItemWithName) => void;
    config: { [key: string]: { [key: string]: any } };
    showMine: boolean;
}

const ToolCatalog: React.FC<ToolCatalogProps> = ({ config, search, catalogItems, client, onSecretChange, secrets, registryItems, showMine }) => {

    const { getCanRegisterCatalogItem } = useCatalogContext();

    const tileIsRegistered = (item: CatalogItemWithName) => registryItems[item.name]?.ref !== undefined && getCanRegisterCatalogItem(item);

    const filteredCatalogItems = catalogItems.filter(item => {
        const isRegistered = tileIsRegistered(item);
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const hideBecauseItsNotMine = showMine && !isRegistered;
        return matchesSearch && !hideBecauseItsNotMine;
    });

    return (
        <Grid2 container spacing={1} sx={CATALOG_LAYOUT_SX}>
            {filteredCatalogItems.map((catalogItem) => {
                const expectedKeys = catalogItem.config?.map((c: any) => c.name) || [];
                const unAssignedConfig = expectedKeys?.filter((c: any) => config[catalogItem.name]?.[c] === undefined);
                return (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={catalogItem.name}>
                        <Tile
                            item={catalogItem}
                            registered={tileIsRegistered(catalogItem)}
                            onSecretChange={onSecretChange}
                            secrets={secrets}
                            unAssignedConfig={unAssignedConfig}
                            client={client}
                        />
                    </Grid2>
                )
            })}
        </Grid2>
    );
};

export default ToolCatalog; 