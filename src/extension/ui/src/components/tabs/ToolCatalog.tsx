import React from 'react';
import { Grid2 } from '@mui/material';
import Tile from '../tile/Index';
import { v1 } from "@docker/extension-api-client-types";
import { CATALOG_LAYOUT_SX } from '../../Constants';
import { useCatalog } from '../../hooks/useCatalog';

interface ToolCatalogProps {
    search: string;
    client: v1.DockerDesktopClient;
    showMine: boolean;
}

const ToolCatalog: React.FC<ToolCatalogProps> = ({ search, client, showMine }) => {
    const { catalogItems } = useCatalog(client)
    const filteredCatalogItems = catalogItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const hideBecauseItsNotMine = showMine && !item.registered;
        return matchesSearch && !hideBecauseItsNotMine;
    });

    return (
        <Grid2 container spacing={1} sx={CATALOG_LAYOUT_SX}>
            {filteredCatalogItems.map((catalogItem) => {
                return (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={catalogItem.name}>
                        <Tile
                            item={catalogItem}
                            client={client}
                        />
                    </Grid2>
                )
            })}
        </Grid2>
    );
};

export default ToolCatalog; 