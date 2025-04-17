import { Button, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { Alert, Stack } from "@mui/material";
import { CatalogItemWithName } from "../../types/catalog";
import { useEffect, useState, useCallback, useMemo } from "react";
import * as JsonSchema from "json-schema-library";
import { getTemplateForItem, useConfigContext } from "../../context/ConfigContext";
import { deepFlattenObject, deepSet } from "../../MergeDeep";
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

    const { config: existingConfig, saveConfig: updateExistingConfig, configLoading, tryLoadConfig } = useConfigContext();

    const existingConfigForItem = existingConfig?.[catalogItem.name];

    // Create a key that changes whenever existingConfigForItem changes
    const configKey = useMemo(() =>
        existingConfigForItem ? JSON.stringify(existingConfigForItem) : 'empty-config',
        [existingConfigForItem]);

    const [localConfig, setLocalConfig] = useState<{ [key: string]: any } | undefined>(undefined);
    const [config, setConfig] = useState<any>(undefined);
    const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());

    // Use memoized flattenedConfig to ensure it only updates when config changes
    // This MUST be called before any early returns to avoid conditional hook calls
    const flattenedConfig = useMemo(() =>
        config ? deepFlattenObject(config) : {},
        [config]);

    // Reset local config when the existing config changes
    useEffect(() => {
        if (!configSchema) return;

        try {
            const template = getTemplateForItem(catalogItem, existingConfigForItem);
            setConfig(template);
            setLocalConfig(deepFlattenObject(template));
        } catch (error) {
            console.error("Error processing config schema:", error);
        }
    }, [existingConfig, existingConfigForItem, configSchema, configKey]);

    // Handle saving a config item
    const handleSaveConfig = async (key: string) => {
        if (savingKeys.has(key)) return;

        try {
            setSavingKeys(prev => new Set([...prev, key]));
            const updatedConfig = deepSet(existingConfigForItem || {}, key, localConfig?.[key]);

            // Force a deep clone to ensure we're sending a new object reference
            const cleanConfig = JSON.parse(JSON.stringify(updatedConfig));

            // Wait for the config update to complete
            await updateExistingConfig(catalogItem.name, cleanConfig);

            // Also update our local state to match the new saved state
            const schema = new JsonSchema.Draft2019(configSchema[0]);
            const newTemplate = schema.getTemplate(cleanConfig);
            setConfig(newTemplate);

            // Reset localConfig to match the new template
            setLocalConfig(deepFlattenObject(newTemplate));

            // After saving, force a refetch to ensure UI is in sync
            await tryLoadConfig();
        } catch (error) {
            console.error("Error saving config:", error);
        } finally {
            setSavingKeys(prev => {
                const updated = new Set([...prev]);
                updated.delete(key);
                return updated;
            });
        }
    };

    // Early returns
    if (!configSchema) {
        return <EmptyState />;
    }

    if (!existingConfig && !configLoading) {
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
                                    <IconButton onClick={() => handleSaveConfig(key)}>
                                        <CheckOutlined sx={{ color: 'success.main' }} />
                                    </IconButton>
                                )}
                                <IconButton
                                    onClick={() => {
                                        // Reset this field to match the original config
                                        setLocalConfig({
                                            ...localConfig,
                                            [key]: flattenedConfig[key]
                                        });
                                    }}
                                    disabled={isSaving}
                                >
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
