import React from 'react';
import { Grid2 } from '@mui/material';
import { CatalogItemCard, CatalogItemWithName } from '../PromptCard';
import { Ref } from '../../Refs';
import Secrets from '../../Secrets';
import { MCP_POLICY_NAME } from '../../Constants';

interface YourToolsProps {
    search: string;
    registryItems: { [key: string]: { ref: string, config: any } };
    config: { [key: string]: { [key: string]: any } };
    ddVersion: { version: string, build: number };
    canRegister: boolean;
    setConfiguringItem: (item: any) => void;
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
                        <CatalogItemCard
                            hasAllConfig={hasAllConfig}
                            ddVersion={ddVersion}
                            item={catalogItem}
                            openUrl={() => { }}
                            canRegister={canRegister}
                            registered={true}
                            register={async () => { }}
                            unregister={async () => { }}
                            onSecretChange={async (secret) => {
                                // This is a placeholder - actual implementation would need the client
                                console.log('Secret change:', secret);
                            }}
                            secrets={secrets}
                            setConfiguringItem={setConfiguringItem}
                        />
                    </Grid2>
                );
            })}
        </Grid2>
    );
};

export default YourTools; 