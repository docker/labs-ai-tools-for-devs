import React from 'react';
import { Grid2 } from '@mui/material';
import Tile, { CatalogItemWithName } from '../tile/Tile';
import Secrets from '../../Secrets';
import { MCP_POLICY_NAME } from '../../Constants';
import TileActions from '../tile/TileActions';
import { v1 } from '@docker/extension-api-client-types';
import { createDockerDesktopClient } from '@docker/extension-api-client';

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

interface YourToolsProps {
    search: string;
    registryItems: { [key: string]: { ref: string, config: any } };
    config: { [key: string]: { [key: string]: any } };
    ddVersion: { version: string, build: number };
    canRegister: boolean;
    setConfiguringItem: (item: CatalogItemWithName) => void;
    secrets: Secrets.Secret[];
}

const YourTools: React.FC<YourToolsProps> = ({
    search,
    registryItems,
    config,
    ddVersion,
    canRegister,
    setConfiguringItem,
    secrets
}) => {
    return (
        <Grid2 container spacing={1} width='90vw' maxWidth={1000}>
            {Object.entries(registryItems).map(([name, item]) => {
                const hasAllConfig = item.config?.map((c: any) => c.name).every((c: any) => config[name]?.[c]);
                if (!name.toLowerCase().includes(search.toLowerCase())) return null;

                const catalogItem: CatalogItemWithName = {
                    name,
                    ref: item.ref,
                    prompts: 0,
                    resources: [],
                    tools: [],
                    config: item.config
                };

                return (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={name}>
                        <Tile
                            openUrl={() => { }}
                            item={catalogItem}
                            registered={true}
                            onSecretChange={async () => { }}
                            secrets={secrets}
                            ActionsSlot={<TileActions
                                hasAllConfig={hasAllConfig}
                                setConfiguringItem={setConfiguringItem}
                                item={catalogItem}
                                ddVersion={ddVersion}
                                registered={true}
                                register={async () => { }}
                                unregister={async () => { }}
                                onSecretChange={async () => { }}
                                secrets={secrets}
                                canRegister={canRegister}
                            />}
                        />
                    </Grid2>
                );
            })}
        </Grid2>
    );
};

export default YourTools; 