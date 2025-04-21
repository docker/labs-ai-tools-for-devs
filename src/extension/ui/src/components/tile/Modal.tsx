import { Alert, Badge, Box, ButtonGroup, CircularProgress, Divider, FormControlLabel, Grid2, IconButton, Link, Modal, Paper, Stack, Switch, Tab, Tabs, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { CheckOutlined, Close, CloseOutlined, DeleteOutlined } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { CatalogItemRichened } from "../../types/catalog";
import Secrets from "../../Secrets";
import { v1 } from "@docker/extension-api-client-types";
import { ASSIGNED_SECRET_PLACEHOLDER, CATALOG_LAYOUT_SX, MCP_POLICY_NAME, UNASSIGNED_SECRET_PLACEHOLDER } from "../../Constants";
import ConfigEditor from "./ConfigEditor";
import { useSecrets } from "../../hooks/useSecrets";
import { useCatalogOperations, useRegistry } from "../../hooks/useCatalog";
import { useConfig } from "../../hooks/useConfig";

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

interface ConfigurationModalProps {
    open: boolean;
    onClose: () => void;
    catalogItem: CatalogItemRichened;
    client: v1.DockerDesktopClient;
}


const ConfigurationModal = ({
    open,
    onClose,
    catalogItem,
    client,
}: ConfigurationModalProps) => {
    const [localSecrets, setLocalSecrets] = useState<{ [key: string]: string | undefined }>({});
    const theme = useTheme();

    const { isLoading: secretsLoading, mutate: mutateSecret } = useSecrets(client)
    const { registryLoading } = useRegistry(client)
    const { registerCatalogItem, unregisterCatalogItem } = useCatalogOperations(client)
    const { configLoading } = useConfig(client)

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

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const contributesNoConfigOrSecrets = (!catalogItem.config || catalogItem.config.length === 0) && (!catalogItem.secrets || catalogItem.secrets.length === 0);

    if (secretsLoading || registryLoading) {
        return <>
            <CircularProgress />
            <Typography>Loading registry...</Typography>
        </>
    }

    const canRegister = catalogItem.canRegister;
    const registered = catalogItem.registered;

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
                height: '80vh',
                width: '80vw',
                maxWidth: '1000px',
                minWidth: '400px',
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
                <Typography sx={{ mt: 2, maxHeight: '5em', overflow: 'auto' }} color="text.secondary">
                    {catalogItem.description}
                </Typography>
                <Tooltip placement="right" title={!canRegister ? 'You must assign all secrets and configure the item before it can be used.' : ''}>
                    <FormControlLabel control={<Switch disabled={!canRegister} checked={true} onChange={(e) => registerCatalogItem(catalogItem)} />} label={registered ? 'Disable ' + `${catalogItem.name} tools` : 'Enable ' + `${catalogItem.name} tools`} sx={{ mt: 2 }} />
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
                                <Tab disabled={contributesNoConfigOrSecrets} label={<Badge invisible={canRegister} sx={{ pl: 1, pr: 1 }} variant="dot" badgeContent={catalogItem.config && catalogItem.config.length > 0 ? 'Secrets' : 'Config'} color="error">Config & Secrets</Badge>} />
                            </Tabs>
                        </Box>
                        <TabPanel value={tabValue} index={0} >
                            {!catalogItem?.tools?.length && (
                                <Typography>
                                    No tools available for this item.
                                </Typography>
                            )}
                            <Grid2 container spacing={2} alignItems="flex-start" sx={{ mt: 1, overflow: 'auto', maxHeight: 'calc(80vh - 350px)' }}>
                                {(catalogItem.tools || []).map((tool) => (
                                    <Grid2 key={tool.name} size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
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
                            <Stack direction="column" spacing={1} sx={{ overflow: 'auto', maxHeight: 'calc(80vh - 350px)' }}>
                                <Stack direction="column" spacing={2} sx={{ border: '2px solid', borderColor: theme.palette.warning.contrastText, borderRadius: 2, p: 2, mt: 2 }}>
                                    <ConfigEditor catalogItem={catalogItem} client={client} />
                                    <Typography variant="h6" sx={{ mb: 1 }}>Secrets</Typography>
                                    {
                                        catalogItem.secrets && catalogItem.secrets?.length > 0 ? (
                                            assignedSecrets?.map(secret => {
                                                const secretEdited = secret.assigned ? localSecrets[secret.name] !== ASSIGNED_SECRET_PLACEHOLDER : localSecrets[secret.name] !== '';
                                                return (
                                                    <Stack key={secret.name} direction="row" spacing={2} alignItems="center">
                                                        <TextField key={secret.name} label={secret.name} value={localSecrets[secret.name]} fullWidth onChange={(e) => {
                                                            setLocalSecrets({ ...localSecrets, [secret.name]: e.target.value });
                                                        }} type='password' />
                                                        {secret.assigned && !secretEdited && <IconButton size="small" color="error" onClick={() => {
                                                            setLocalSecrets({ ...localSecrets, [secret.name]: UNASSIGNED_SECRET_PLACEHOLDER });
                                                            mutateSecret.mutateAsync({ name: secret.name, value: UNASSIGNED_SECRET_PLACEHOLDER, policies: [MCP_POLICY_NAME] });
                                                        }}>
                                                            <DeleteOutlined />
                                                        </IconButton>}
                                                        {secretEdited && <ButtonGroup>
                                                            <IconButton onClick={async () => {
                                                                await mutateSecret.mutateAsync({ name: secret.name, value: localSecrets[secret.name]!, policies: [MCP_POLICY_NAME] });
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
                                            })) : (
                                            <Alert severity="info">No secrets available for this item.</Alert>
                                        )
                                    }
                                </Stack>
                            </Stack>
                        </TabPanel >
                        <TabPanel value={tabValue} index={2}>
                            <Typography>Examples</Typography>
                            WIP
                        </TabPanel>
                    </>
                )}
            </Paper >
        </Modal >
    )
};

export default ConfigurationModal; 