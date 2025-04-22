import React from 'react';
import { Alert, AlertTitle, Grid2 } from '@mui/material';
import Tile from '../tile/Index';
import { CATALOG_LAYOUT_SX, MCP_POLICY_NAME } from '../../Constants';
import TileActions from '../tile/Bottom';
import { v1 } from '@docker/extension-api-client-types';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { CatalogItemRichened } from '../../types/catalog';
import { Secret } from '../../types/secrets';
import { useCatalog } from '../../hooks/useCatalog';
// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

interface YourToolsProps {
    search: string;
}

const YourTools: React.FC<YourToolsProps> = ({
    search,
}) => {
    const { catalogItems } = useCatalog(client)
    return (
        <Grid2 container spacing={1} sx={CATALOG_LAYOUT_SX}>
            {catalogItems.map((catalogItem) => {
                if (!catalogItem.name.toLowerCase().includes(search.toLowerCase())) return null;
                return (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={catalogItem.name}>
                        <Tile
                            item={catalogItem}
                            client={client}
                        />
                    </Grid2>
                );
            })}
        </Grid2>
    );
};

export default YourTools; 