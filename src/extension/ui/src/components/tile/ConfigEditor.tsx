import { Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { Alert, Stack } from "@mui/material";
import { CatalogItemRichened } from "../../types/catalog";
import { useEffect, useState, useCallback, useMemo } from "react";
import * as JsonSchema from "json-schema-library";
import { getTemplateForItem, useConfig } from "../../hooks/useConfig";
import { deepFlattenObject, deepSet } from "../../MergeDeep";
import { CheckOutlined, CloseOutlined } from "@mui/icons-material";
import { v1 } from "@docker/extension-api-client-types";

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

const ConfigEditor = ({ catalogItem, client }: { catalogItem: CatalogItemRichened, client: v1.DockerDesktopClient }) => {
    const configSchema = catalogItem.configSchema;

    const { config, saveConfig: updateExistingConfig, configLoading } = useConfig(client);

    const existingConfigForItem = catalogItem.configValue || {};


    const [localConfig, setLocalConfig] = useState<{ [key: string]: any } | undefined>(undefined);
    const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());

    // Use memoized flattenedConfig to ensure it only updates when config changes
    // This MUST be called before any early returns to avoid conditional hook calls
    const flattenedConfig = useMemo(() =>
        configSchema ? deepFlattenObject({ ...catalogItem.configTemplate, ...existingConfigForItem }) : {},
        [catalogItem.configTemplate, existingConfigForItem, configSchema]);

    // Reset local config when the existing config changes
    useEffect(() => {
        if (!configSchema) return;
        setLocalConfig(flattenedConfig);
    }, [flattenedConfig]);

    // Early returns
    if (!configSchema) {
        return <EmptyState />;
    }

    if (!config && !configLoading) {
        return <EmptyState />;
    }

    if (configLoading) {
        return <LoadingState />;
    }

    if (!config || !localConfig) {
        return <LoadingState />;
    }

    return (
        <Stack>
            <Typography variant="h6">Config</Typography>
            <Stack direction="column" spacing={2}>
                {Object.keys(flattenedConfig).map((key: string) => {
                    const edited = localConfig[key] !== flattenedConfig[key];
                    const isSaving = savingKeys.has(key);

                    return (
                        <Stack key={key} direction="row" spacing={2}>
                            <TextField
                                label={key}
                                value={localConfig[key] || ''}
                                onChange={(e) => setLocalConfig({ ...localConfig, [key]: e.target.value })}
                                disabled={isSaving}
                            />
                            {edited && <Stack direction="row" spacing={2}>
                                {isSaving ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <Stack direction="row" spacing={2}>
                                        <IconButton onClick={() => updateExistingConfig(catalogItem.name, localConfig)}
                                            disabled={isSaving}
                                        >
                                            <CheckOutlined sx={{ color: 'success.main' }} />
                                        </IconButton>
                                        <IconButton onClick={() => setLocalConfig({
                                            ...localConfig,
                                            [key]: flattenedConfig[key]
                                        })}
                                            disabled={isSaving}
                                        >
                                            <CloseOutlined sx={{ color: 'error.main' }} />
                                        </IconButton>
                                    </Stack>
                                )}
                            </Stack>}
                        </Stack>
                    )
                })}
            </Stack>
        </Stack>
    )
}

export default ConfigEditor;
