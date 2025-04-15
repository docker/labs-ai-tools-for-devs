import { Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { Alert, Stack } from "@mui/material";
import { CatalogItemWithName } from "../../types/catalog";
import { useEffect, useState } from "react";
import * as JsonSchema from "json-schema-library";
import { useConfigContext } from "../../context/ConfigContext";
import { config } from "process";
import { buildObjectFromFlattenedObject, deepFlattenObject, deepSet, mergeDeep } from "../../MergeDeep";
import { CheckOutlined, CloseOutlined } from "@mui/icons-material";

JsonSchema.settings.GET_TEMPLATE_RECURSION_LIMIT = 1000;
JsonSchema.settings.templateDefaultOptions.addOptionalProps = true;

const EmptyState = () => {
    return (
        <Alert severity="info"> No config available </Alert>
    )
}

const LoadingState = () => {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress />
            <Typography>Loading config...</Typography>
        </Stack>
    )
}

const ConfigEditor = ({ catalogItem }: { catalogItem: CatalogItemWithName }) => {
    const configSchema = catalogItem.config;

    const { config: existingConfig, saveConfig: updateExistingConfig, configLoading } = useConfigContext();

    const existingConfigForItem = existingConfig?.[catalogItem.name];

    if (!configSchema) {
        return <EmptyState />
    }

    if (!existingConfig && !configLoading) {
        return <EmptyState />
    }

    if (configLoading) {
        return <LoadingState />
    }

    const [localConfig, setLocalConfig] = useState<{ [key: string]: any } | undefined>(undefined);

    const [config, setConfig] = useState(existingConfigForItem);

    useEffect(() => {
        const schema = new JsonSchema.Draft2019(configSchema[0]);
        const template = schema.getTemplate(existingConfigForItem);
        if (!localConfig) {
            setLocalConfig(deepFlattenObject(template));
        }
        setConfig(template);
    }, [configSchema, existingConfigForItem]);

    if (!config || !localConfig) {
        return <EmptyState />
    }

    const flattenedConfig = deepFlattenObject(config);

    return (
        <Stack>
            <Typography variant="h6">Config</Typography>
            <Stack direction="column" spacing={2}>
                {Object.keys(flattenedConfig).map((key: string) => {
                    const edited = localConfig[key] !== flattenedConfig[key];
                    return (
                        <Stack key={key} direction="row" spacing={2}>
                            <TextField label={key} value={localConfig[key]} onChange={(e) => setLocalConfig({ ...localConfig, [key]: e.target.value })} />
                            {edited && <Stack direction="row" spacing={2}><IconButton onClick={() => {
                                const updatedConfig = deepSet(existingConfigForItem || {}, key, localConfig[key]);
                                updateExistingConfig(catalogItem.name, updatedConfig);
                            }}>
                                <CheckOutlined sx={{ color: 'success.main' }} />
                            </IconButton>
                                <IconButton onClick={() => setLocalConfig(undefined)}>
                                    <CloseOutlined sx={{ color: 'error.main' }} />
                                </IconButton>
                            </Stack>}
                        </Stack>
                    )
                })}
            </Stack>
        </Stack>
    )
}

export default ConfigEditor;
