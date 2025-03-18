import { Badge, Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material";
import { LockReset, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CatalogItemWithName } from "./tile/Tile";
import Secrets from "../Secrets";
import { v1 } from "@docker/extension-api-client-types";
import { getStoredConfig } from "../Registry";
import { stringify } from "yaml";
import { tryRunImageSync } from "../FileWatcher";
import { useCatalogContext } from "../context/CatalogContext";
import { DeepObject, mergeDeep } from "../MergeDeep";
import { githubLightTheme, NodeData, githubDarkTheme, JsonEditor } from "json-edit-react";

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

// Define types (moved from PromptConfig.tsx)
const types = ['string', 'number', 'boolean', 'array', 'object'] as const;

export type Parameter = {
    type?: typeof types[number];
    description?: string;
};

export type ParameterArray = {
    type: 'array';
    items: Parameter;
    description?: string;
};

export type ParameterObject = {
    type: 'object';
    properties: {
        [key: string]: Parameter;
    };
    description?: string;
};

export type Parameters = Parameter | ParameterArray | ParameterObject;

export type ParsedParameter = any;
export type ParsedParameterArray = any[];
export type ParsedParameterObject = Record<string, any>;
export type ParsedParameters = any;

export type Config = {
    name: string;
    description: string;
    parameters: Parameters
}[];

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
    secrets: Secrets.Secret[];
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
}

const ConfigurationModal = ({
    open,
    onClose,
    catalogItem,
    client,
    secrets,
    onSecretChange
}: ConfigurationModalProps) => {
    const { config, registryItems, tryUpdateConfig, startSyncing } = useCatalogContext();
    const theme = useTheme();

    // State for tabs
    const [tabValue, setTabValue] = useState(0);

    // State for secrets
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([]);
    const [changedSecrets, setChangedSecrets] = useState<{ [key: string]: string | undefined }>({});
    const [secretLoading, setSecretLoading] = useState(false);

    // State for config
    const [configLoading, setConfigLoading] = useState(true);
    const [loadedConfig, setLoadedConfig] = useState<{ [key: string]: any }>({});

    // Load assigned secrets
    useEffect(() => {
        const loadedSecrets = Secrets.getAssignedSecrets(catalogItem, secrets);
        setAssignedSecrets(loadedSecrets);
    }, [catalogItem, secrets]);

    // Load config
    useEffect(() => {
        try {
            const item = config[catalogItem.name] || {};
            setLoadedConfig(item);
        } catch (error) {
            console.error(error);
        }
        setConfigLoading(false);
    }, [catalogItem, config]);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Save config to YAML
    const saveConfigToYaml = async (newConfig: { [key: string]: any }) => {
        try {
            setConfigLoading(true);
            const currentStoredConfig = await getStoredConfig(client);
            currentStoredConfig[catalogItem.name] = newConfig;
            const payload = JSON.stringify({
                files: [{
                    path: 'config.yaml',
                    content: stringify(currentStoredConfig)
                }]
            });
            await tryRunImageSync(client, ['--rm', '-v', 'docker-prompts:/docker-prompts', '--workdir', '/docker-prompts', 'vonwig/function_write_files:latest', `'${payload}'`]);
            await startSyncing();
            console.log('Config saved successfully');
            setTimeout(() => {
                setConfigLoading(false);
            }, 500);
        } catch (error) {
            client.desktopUI.toast.error('Failed to update config: ' + error);
            setConfigLoading(false);
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

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h6">
                    Configuring {catalogItem.name}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {(configLoading || secretLoading) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                {hasSecrets && <Tab label="Secrets" />}
                                {hasConfig && <Tab label="Configuration" />}
                            </Tabs>
                        </Box>

                        {/* Secrets Tab */}
                        {hasSecrets && (
                            <TabPanel value={tabValue} index={0}>
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
                                                    onSecretChange({ name: secret.name, value: changedSecrets[secret.name] || '' }).then(() => {
                                                        setSecretLoading(false);
                                                        const newChangedSecrets = { ...changedSecrets };
                                                        delete newChangedSecrets[secret.name];
                                                        setChangedSecrets(newChangedSecrets);
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
                                {catalogItem.config!.map(config => (
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
            </DialogContent>
        </Dialog>
    );
};

export default ConfigurationModal; 