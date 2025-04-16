import { Alert, Badge, Box, ButtonGroup, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel, FormHelperText, Grid2, IconButton, Link, Modal, Paper, Stack, Switch, Tab, Tabs, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { CheckOutlined, Close, CloseOutlined, Code, Delete, DeleteOutline, DeleteOutlined, LockReset, Save, SaveOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CatalogItemWithName } from "../../types/catalog";
import Secrets from "../../Secrets";
import { v1 } from "@docker/extension-api-client-types";
import { useCatalogContext } from "../../context/CatalogContext";
import { useConfigContext } from "../../context/ConfigContext";
import { deepFlattenObject, deepGet, deepSet, mergeDeep } from "../../MergeDeep";
import { DeepObject } from "../../types/utils";
import { Parameter, ParameterArray, ParameterObject, Parameters, ParsedParameters, Config } from "../../types/config";
import { Ref } from "../../Refs";
import { ASSIGNED_SECRET_PLACEHOLDER, CATALOG_LAYOUT_SX, UNASSIGNED_SECRET_PLACEHOLDER } from "../../Constants";
import JsonSchemaLibrary from "json-schema-library";
import ConfigEditor from "./ConfigEditor";

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
    unAssignedSecrets: { name: string, assigned: boolean }[];
}


const ConfigurationModal = ({
    open,
    onClose,
    catalogItem,
    client,
    onToggleRegister,
    registered,
    onSecretChange,
    unAssignedSecrets,
}: ConfigurationModalProps) => {

    const { registryItems, secrets } = useCatalogContext();
    const { config, configLoading } = useConfigContext();
    const [localSecrets, setLocalSecrets] = useState<{ [key: string]: string | undefined }>({});
    const theme = useTheme();

    // Helper function to get default values based on type
    const getDefaultValue = (schema: any) => {
        if (!schema || !schema.type) return '';

        switch (schema.type) {
            case 'string':
                return schema.default || '';
            case 'number':
            case 'integer':
                return schema.default || 0;
            case 'boolean':
                return schema.default || false;
            case 'array':
                return schema.default || [];
            case 'object':
                if (schema.properties) {
                    const objTemplate: Record<string, any> = {};
                    Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
                        objTemplate[key] = getDefaultValue(propSchema);
                    });
                    return schema.default || objTemplate;
                }
                return schema.default || {};
            default:
                return '';
        }
    };

    const toolChipStyle = {
        padding: '2px 8px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        color: theme.palette.docker.grey[700],
        background: theme.palette.docker.grey[100],
        border: 1,
        borderColor: theme.palette.docker.grey[200],
        textAlign: 'center',
        borderRadius: 4,
        fontFamily: 'Roboto Mono',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 400,
    }

    // State for tabs
    const [tabValue, setTabValue] = useState(0);

    // State for secrets
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([]);

    // Load assigned secrets
    useEffect(() => {
        const loadedSecrets = Secrets.getAssignedSecrets(catalogItem, secrets);
        setAssignedSecrets(loadedSecrets);
        setLocalSecrets(loadedSecrets.reduce((acc, secret) => {
            acc[secret.name] = secret.assigned ? ASSIGNED_SECRET_PLACEHOLDER : '';
            return acc;
        }, {} as { [key: string]: string | undefined }));
    }, [catalogItem, secrets]);


    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
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

    const hasAllSecrets = unAssignedSecrets.length === 0
    const emptyConfig = !config?.[catalogItem.name] || Object.keys(config?.[catalogItem.name] || {}).length === 0

    console.log(hasAllSecrets, emptyConfig)

    useEffect(() => {
        if (!hasAllSecrets || emptyConfig) {
            setTabValue(1); // Secrets tab
        }
    }, [hasAllSecrets, emptyConfig]);


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
                height: '70vh',
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
                <Tooltip placement="right" title={!hasAllSecrets || emptyConfig ? 'You must assign all secrets and configure the item before it can be used.' : ''}>
                    <FormControlLabel control={<Switch disabled={!hasAllSecrets || emptyConfig} checked={registered} onChange={(e) => onToggleRegister(e.target.checked)} />} label={registered ? 'Disable ' + `${catalogItem.name} tools` : 'Enable ' + `${catalogItem.name} tools`} sx={{ mt: 2 }} />
                </Tooltip>
                <Divider sx={{ mt: 2 }} />
                <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                    Repository: <Link onClick={() => client.host.openExternal(catalogItem.source || '')} href={catalogItem.source || ''} target="_blank">{catalogItem.source || ''}⤴</Link>
                </Typography>
                {(configLoading) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CircularProgress />
                            <Typography>Loading config...</Typography>
                        </Stack>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label="Tools" />
                                {/* <Tab label="Prompts" /> */}
                                <Tab disabled={!hasSecrets && !hasConfig} label={<Badge invisible={hasAllSecrets && !emptyConfig} sx={{ pl: 1, pr: 1 }} variant="dot" badgeContent={hasSecrets ? 'Secrets' : 'Config'} color="error">Config & Secrets</Badge>} />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            {!catalogItem?.tools?.length && (
                                <Typography>
                                    No tools available for this item.
                                </Typography>
                            )}
                            <Grid2 container spacing={2} alignItems="flex-start" sx={{ overflow: 'auto', maxHeight: 350 }}>
                                {(catalogItem.tools || []).map((tool) => (
                                    <Grid2 key={tool.name} size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                        <Tooltip title={tool.name}>
                                            <Typography component="span" key={tool.name} sx={toolChipStyle}>
                                                {tool.name.slice(0, 30) + (tool.name.length > 30 ? '...' : '')}
                                            </Typography>
                                        </Tooltip>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Stack direction="column" spacing={1} sx={{ overflow: 'auto', maxHeight: 350 }}>
                                <Stack direction="column" spacing={2} sx={{ border: '2px solid', borderColor: theme.palette.warning.contrastText, borderRadius: 2, p: 2, mt: 2 }}>
                                    <ConfigEditor catalogItem={catalogItem} />
                                    <Typography variant="h6" sx={{ mb: 1 }}>Secrets</Typography>
                                    {assignedSecrets?.map(secret => {
                                        const secretEdited = secret.assigned ? localSecrets[secret.name] !== ASSIGNED_SECRET_PLACEHOLDER : localSecrets[secret.name] !== '';
                                        return (
                                            <Stack key={secret.name} direction="row" spacing={2} alignItems="center">
                                                <TextField key={secret.name} label={secret.name} value={localSecrets[secret.name]} fullWidth onChange={(e) => {
                                                    setLocalSecrets({ ...localSecrets, [secret.name]: e.target.value });
                                                }} type='password' />
                                                {secret.assigned && !secretEdited && <IconButton size="small" color="error" onClick={() => {
                                                    setLocalSecrets({ ...localSecrets, [secret.name]: UNASSIGNED_SECRET_PLACEHOLDER });
                                                    onSecretChange({ name: secret.name, value: UNASSIGNED_SECRET_PLACEHOLDER });
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
                                                        setLocalSecrets({ ...localSecrets, [secret.name]: secret.assigned ? ASSIGNED_SECRET_PLACEHOLDER : '' });
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