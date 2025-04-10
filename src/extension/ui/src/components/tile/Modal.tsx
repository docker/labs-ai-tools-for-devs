import { Badge, Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, Link, Modal, Paper, Stack, Switch, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material";
import { Close, LockReset, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CatalogItemWithName } from "../../types/catalog";
import Secrets from "../../Secrets";
import { v1 } from "@docker/extension-api-client-types";
import { githubLightTheme, NodeData, githubDarkTheme, JsonEditor } from "json-edit-react";
import { useCatalogContext } from "../../context/CatalogContext";
import { useConfigContext } from "../../context/ConfigContext";
import { mergeDeep } from "../../MergeDeep";
import { DeepObject } from "../../types/utils";
import { Parameter, ParameterArray, ParameterObject, Parameters, ParsedParameter, ParsedParameterArray, ParsedParameterObject, ParsedParameters, Config } from "../../types/config";
import { Ref } from "../../Refs";
import { CATALOG_LAYOUT_SX } from "../../Constants";

// Styles for the tab panel
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`configuration-tabpanel-${index}`}
            aria-labelledby={`configuration-tab-${index}`}
            {...other}
            style={{ padding: '16px 0' }}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Define types reference
const types = ['string', 'number', 'boolean', 'array', 'object'] as const;

// Given a path in parsed JSON, returns the type of the value at that path from the tile's config
const jsonEditorTypeFilterFunction = ({ path }: NodeData, config: Config[number]['parameters']) => {
    if (path.length === 0) {
        return true;
    }
    // Converts a path in parsed JSON BACK into config format with properties and items
    const configKeyFromPath = path.map(p => {
        if (typeof p === 'string') {
            return `properties.${p}`;
        }
        if (typeof p === 'number') {
            return `items`;
        }
        return p;
    }).join('.');

    let configValue: any = { properties: config };
    for (const key of configKeyFromPath.split('.')) {
        configValue = configValue[key];
    }
    return [configValue.type];
};

// Converts a config parameter object into a parsed JSON object that is easier to edit using the json-edit-react library
const convertParametersToEditableJSON = (parameters: Config[number]['parameters']): ParsedParameters => {
    if (parameters.type === 'object') {
        return Object.fromEntries(Object.entries((parameters as ParameterObject).properties).map(([key, value]) => [key, convertParametersToEditableJSON(value)]));
    }
    if (parameters.type === 'array') {
        return [convertParametersToEditableJSON((parameters as ParameterArray).items)];
    }
    if (parameters.type === 'string') {
        return '';
    }
    if (parameters.type === 'number') {
        return 0;
    }
    if (parameters.type === 'boolean') {
        return false;
    }
    if (!parameters.type) {
        return Object.fromEntries(Object.entries(parameters).map(([key, value]) => [key, convertParametersToEditableJSON(value as Parameters)]));
    }
    return '';
};

// Given a path in parsed JSON, returns false to prevent editing anything but basic types
const jsonEditorFilterFunction = ({ value }: NodeData) => {
    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' || !value) {
        return false;
    }
    // Return true to prevent editing
    return true;
};

interface ConfigurationModalProps {
    open: boolean;
    onClose: () => void;
    catalogItem: CatalogItemWithName;
    client: v1.DockerDesktopClient;
    onToggleRegister: (checked: boolean) => void;
    registered: boolean;
}

const ConfigurationModal = ({
    open,
    onClose,
    catalogItem,
    client,
    onToggleRegister,
    registered,
}: ConfigurationModalProps) => {
    const { startPull, registryItems, tryUpdateSecrets, secrets } = useCatalogContext();
    const { config, configLoading, saveConfig } = useConfigContext();
    const theme = useTheme();

    // State for tabs
    const [tabValue, setTabValue] = useState(0);

    // State for secrets
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([]);
    const [changedSecrets, setChangedSecrets] = useState<{ [key: string]: string | undefined }>({});
    const [secretLoading, setSecretLoading] = useState(false);

    // State for config
    const [loadedConfig, setLoadedConfig] = useState<{ [key: string]: any }>({});

    // Load assigned secrets
    useEffect(() => {
        const loadedSecrets = Secrets.getAssignedSecrets(catalogItem, secrets);
        setAssignedSecrets(loadedSecrets);
    }, [catalogItem, secrets]);

    // Load config
    useEffect(() => {
        try {
            const item = config?.[catalogItem.name] || {};
            setLoadedConfig(item);
        } catch (error) {
            console.error(error);
        }
    }, [catalogItem, config]);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Save config to YAML
    const saveConfigToYaml = async (newConfig: { [key: string]: any }) => {
        if (!registryItems) {
            return;
        }
        try {
            await saveConfig(catalogItem.name, newConfig);
            await startPull();
        } catch (error) {
            client.desktopUI.toast.error('Failed to update config: ' + error);
        }
    };

    // Determine if we should show the secrets tab and config tab
    const hasSecrets = assignedSecrets.length > 0;
    const hasConfig = catalogItem.config && catalogItem.config.length > 0;

    // If there's only one tab to show, automatically select it
    useEffect(() => {
        if (!hasSecrets && hasConfig || hasSecrets && !hasConfig) {
            setTabValue(0); // Config tab
        }
    }, [hasSecrets, hasConfig]);

    if (!registryItems) {
        return <CircularProgress />
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="configuration-modal-title"
        >
            <Paper sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxHeight: '90vh',
                overflow: 'auto',
                p: 4,
                outline: 'none'
            }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <img src={catalogItem.icon} alt={catalogItem.name} style={{ width: 30, height: 30, marginRight: 8 }} />
                    <Typography variant="h6" id="configuration-modal-title">
                        {catalogItem.name}
                    </Typography>
                    <IconButton sx={{ position: 'absolute', right: 18 }} onClick={onClose}>
                        <Close />
                    </IconButton>
                </Stack>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                    {catalogItem.description}
                </Typography>
                <FormControlLabel control={<Switch checked={registered} onChange={(e) => onToggleRegister(e.target.checked)} />} label={registered ? 'Disable ' + `${catalogItem.name} tools` : 'Enable ' + `${catalogItem.name} tools`} sx={{ mt: 2 }} />
                <Divider sx={{ mt: 2 }} />
                <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                    Repository: <Link href={Ref.fromRef(catalogItem.ref).toURL()} target="_blank">{Ref.fromRef(catalogItem.ref).toURL()}⤴</Link>
                </Typography>
                {(configLoading || secretLoading) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label="Tools" />
                                <Tab disabled={!hasSecrets && !hasConfig} label="Config & Secrets" />
                                <Tab disabled={!hasConfig} label="Examples" />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            {!catalogItem?.tools?.length && (
                                <Typography>
                                    No tools available for this item.
                                </Typography>
                            )}
                            <Stack sx={{ fontSize: '1.5em' }} direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap">
                                {(catalogItem.tools || []).map((tool) => (
                                    <Chip label={tool.name} />
                                ))}
                            </Stack>
                        </TabPanel>

                        {/* Secrets Tab */}
                        {hasSecrets && (
                            <TabPanel value={tabValue} index={1}>
                                <Stack direction="column" spacing={2}>
                                    {assignedSecrets?.map(secret => (
                                        <Stack key={secret.name} direction="row" spacing={2} alignItems="center">
                                            <TextField
                                                placeholder={assignedSecrets.find(s => s.name === secret.name)?.assigned ? '********' : 'Enter secret value'}
                                                type="password"
                                                key={secret.name}
                                                label={secret.name}
                                                value={changedSecrets[secret.name] || ''}
                                                onChange={(event) => setChangedSecrets({ ...changedSecrets, [secret.name]: event.target.value })}
                                            />
                                            {assignedSecrets.find(s => s.name === secret.name)?.assigned && changedSecrets[secret.name] && (
                                                <IconButton onClick={() => setChangedSecrets({ ...changedSecrets, [secret.name]: undefined })}>
                                                    <LockReset />
                                                </IconButton>
                                            )}
                                            {changedSecrets[secret.name] && (
                                                <IconButton onClick={() => {
                                                    setSecretLoading(true);
                                                    tryUpdateSecrets({ name: secret.name, value: changedSecrets[secret.name] || '' }).then(() => {
                                                        setSecretLoading(false);
                                                        setChangedSecrets({ ...changedSecrets, [secret.name]: undefined });
                                                    });
                                                }}>
                                                    {secretLoading ? <CircularProgress size={20} /> : <Save />}
                                                </IconButton>
                                            )}
                                        </Stack>
                                    ))}
                                </Stack>
                            </TabPanel>
                        )}

                        {/* Configuration Tab */}
                        {hasConfig && (
                            <TabPanel value={tabValue} index={hasSecrets ? 1 : 0}>
                                {catalogItem.config!.map((config: Config[number]) => (
                                    <JsonEditor
                                        key={config.name}
                                        theme={theme.palette.mode === 'dark' ? githubDarkTheme : githubLightTheme}
                                        onEdit={({ newData }) => {
                                            // Ensure we're working with objects that can be merged
                                            const currentConfig = loadedConfig[config.name] || {};
                                            const updatedData = typeof newData === 'object' ? newData : {};
                                            const newConfig = mergeDeep(currentConfig, updatedData);
                                            saveConfigToYaml({ ...loadedConfig, [config.name]: newConfig });
                                        }}
                                        rootName={config.name}
                                        restrictAdd={({ value }) => {
                                            return !Array.isArray(value);
                                        }}
                                        defaultValue={""}
                                        restrictDelete={true}
                                        restrictEdit={jsonEditorFilterFunction}
                                        restrictTypeSelection={(e) => jsonEditorTypeFilterFunction(e, config.parameters)}
                                        data={{ ...convertParametersToEditableJSON(config.parameters), ...(loadedConfig[config.name] || {}) }}
                                    />
                                ))}
                            </TabPanel>
                        )}
                    </>
                )}
            </Paper>
        </Modal>
    );
};

export default ConfigurationModal; 