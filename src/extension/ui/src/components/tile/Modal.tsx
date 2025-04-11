import { Alert, Badge, Box, ButtonGroup, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, Link, Modal, Paper, Stack, Switch, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material";
import { CheckOutlined, Close, CloseOutlined, Delete, DeleteOutline, DeleteOutlined, LockReset, Save, SaveOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CatalogItemWithName } from "../../types/catalog";
import Secrets from "../../Secrets";
import { v1 } from "@docker/extension-api-client-types";
import { useCatalogContext } from "../../context/CatalogContext";
import { useConfigContext } from "../../context/ConfigContext";
import { deepFlattenObject } from "../../MergeDeep";
import { DeepObject } from "../../types/utils";
import { Parameter, ParameterArray, ParameterObject, Parameters, ParsedParameters, Config } from "../../types/config";
import { Ref } from "../../Refs";
import { CATALOG_LAYOUT_SX } from "../../Constants";
import ConfigEditor from "../ConfigEditor";

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


interface ConfigurationModalProps {
    open: boolean;
    onClose: () => void;
    catalogItem: CatalogItemWithName;
    client: v1.DockerDesktopClient;
    onToggleRegister: (checked: boolean) => void;
    registered: boolean;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
}

const ASSIGNED_SECRET_PLACEHOLDER = '********';
const UNASSIGNED_SECRET_PLACEHOLDER = '';

const ConfigurationModal = ({
    open,
    onClose,
    catalogItem,
    client,
    onToggleRegister,
    registered,
    onSecretChange,
}: ConfigurationModalProps) => {
    const { startPull, registryItems, tryUpdateSecrets, secrets } = useCatalogContext();
    const { config, configLoading, saveConfig } = useConfigContext();
    const [localSecrets, setLocalSecrets] = useState<{ [key: string]: string | undefined }>({});
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
        setLocalSecrets(loadedSecrets.reduce((acc, secret) => {
            acc[secret.name] = secret.assigned ? ASSIGNED_SECRET_PLACEHOLDER : UNASSIGNED_SECRET_PLACEHOLDER;
            return acc;
        }, {} as { [key: string]: string | undefined }));
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
        return <>
            <CircularProgress />
            <Typography>Loading registry...</Typography>
        </>
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
                    <img src={catalogItem.icon} alt={catalogItem.name} style={{ width: 40, height: 40, marginRight: 8, backgroundColor: 'white', borderRadius: 4, padding: 4 }} />
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
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CircularProgress />
                            <Typography>Loading config & secrets...</Typography>
                        </Stack>
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
                                    <Chip label={tool.name} key={tool.name} />
                                ))}
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Stack direction="column" spacing={1}>
                                <Stack direction="column" spacing={1} sx={{ border: '2px solid', borderColor: 'divider', borderRadius: 2, p: 2, mt: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>Config</Typography>
                                    {!loadedConfig || !Object.keys(loadedConfig).length && <Alert severity="info">This item has no config</Alert>}
                                    {Object.entries(deepFlattenObject(loadedConfig)).map(([key, value]) => (
                                        <ConfigEditor key={key} keyName={key} value={value} onEdit={async (value) => {
                                            await saveConfigToYaml({ ...loadedConfig, [key]: value });
                                        }} type='string' optional={true} />
                                    ))}
                                </Stack>
                                <Stack direction="column" spacing={2} sx={{ border: '2px solid', borderColor: theme.palette.warning.contrastText, borderRadius: 2, p: 2, mt: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>Secrets</Typography>
                                    {assignedSecrets?.map(secret => {
                                        const secretEdited = secret.assigned ? localSecrets[secret.name] !== ASSIGNED_SECRET_PLACEHOLDER : localSecrets[secret.name] !== UNASSIGNED_SECRET_PLACEHOLDER;
                                        return (
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <TextField key={secret.name} label={secret.name} value={localSecrets[secret.name]} fullWidth onChange={(e) => {
                                                    setLocalSecrets({ ...localSecrets, [secret.name]: e.target.value });
                                                }} type='password' />
                                                {!secretEdited && <IconButton size="small" color="error" onClick={() => {
                                                    setLocalSecrets({ ...localSecrets, [secret.name]: UNASSIGNED_SECRET_PLACEHOLDER });
                                                }}>
                                                    <DeleteOutlined />
                                                </IconButton>}
                                                {secretEdited && <ButtonGroup>
                                                    <IconButton onClick={async () => {
                                                        await onSecretChange({ name: secret.name, value: localSecrets[secret.name]! });
                                                    }}>
                                                        <CheckOutlined sx={{ color: 'success.main' }} />
                                                    </IconButton>
                                                    <IconButton onClick={async () => {
                                                        setLocalSecrets({ ...localSecrets, [secret.name]: secret.assigned ? UNASSIGNED_SECRET_PLACEHOLDER : ASSIGNED_SECRET_PLACEHOLDER });
                                                    }}>
                                                        <CloseOutlined sx={{ color: 'error.main' }} />
                                                    </IconButton>
                                                </ButtonGroup>}
                                            </Stack>
                                        )
                                    })}
                                </Stack>
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                            <Typography>Examples</Typography>
                            WIP
                        </TabPanel>
                    </>
                )}
            </Paper>
        </Modal>
    );
};

export default ConfigurationModal; 