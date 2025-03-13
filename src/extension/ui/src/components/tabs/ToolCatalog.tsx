import React from 'react';
import { Card, CardContent, Grid2, IconButton } from '@mui/material';
import { CatalogItemCard, CatalogItemWithName } from '../PromptCard';
import AddIcon from '@mui/icons-material/Add';
import { Ref } from '../../Refs';
import { v1 } from "@docker/extension-api-client-types";

interface ToolCatalogProps {
    search: string;
    catalogItems: CatalogItemWithName[];
    client: v1.DockerDesktopClient;
}

const ToolCatalog: React.FC<ToolCatalogProps> = ({ search, catalogItems, client }) => {
    const filteredCatalogItems = catalogItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Grid2 container spacing={1} width='90vw' maxWidth={1000}>
            {filteredCatalogItems.map((catalogItem) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={catalogItem.name}>
                    <CatalogItemCard
                        hasAllConfig={true}
                        setConfiguringItem={() => { }}
                        openUrl={() => {
                            client.host.openExternal(Ref.fromRef(catalogItem.ref).toURL(true));
                        }}
                        item={catalogItem}
                        ddVersion={{ version: '0.0.0', build: 0 }}
                        canRegister={false}
                        registered={false}
                        register={async () => { }}
                        unregister={async () => { }}
                        onSecretChange={async () => { }}
                        secrets={[]}
                    />
                </Grid2>
            ))}
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
        </Grid2>
    );
};

export default ToolCatalog; 