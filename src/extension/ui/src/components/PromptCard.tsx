import { Badge, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Switch, TextField, Tooltip } from "@mui/material";
import Button from '@mui/material/Button';
import { Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Ref } from "../Refs";
import { useEffect, useState } from "react";
import { trackEvent } from "../Usage";
import { Article, AttachFile, Build, CheckBox, Delete, LockOpenRounded, LockReset, LockRounded, NoEncryptionGmailerrorred, Save } from "@mui/icons-material";
import Secrets from "../Secrets";
import { DD_BUILD_WITH_SECRET_SUPPORT, getUnsupportedSecretMessage } from "../Constants";

const iconSize = 16

export interface CatalogItem {
    description?: string;
    icon?: string;
    secrets?: { name: string }[];
    ref: string;
    prompts: number;
    resources: object[];
    tools: object[];
}

export interface CatalogItemWithName extends CatalogItem {
    name: string;
}

export function CatalogItemCard({ openUrl, item, canRegister, registered, register, unregister, onSecretChange, secrets, ddVersion }: { openUrl: () => void, item: CatalogItemWithName, canRegister: boolean, registered: boolean, register: (item: CatalogItemWithName) => Promise<void>, unregister: (item: CatalogItemWithName, showNotification?: boolean) => Promise<void>, onSecretChange: (secret: { name: string, value: string }) => Promise<void>, secrets: Secrets.Secret[], ddVersion: { version: string, build: number } }) {
    const loadAssignedSecrets = () => {
        const assignedSecrets = Secrets.getAssignedSecrets(item, secrets);
        setAssignedSecrets(assignedSecrets)
    }
    const [isRegistering, setIsRegistering] = useState(false)
    const [showSecretDialog, setShowSecretDialog] = useState(false)
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([])
    const [changedSecrets, setChangedSecrets] = useState<{ [key: string]: string | undefined }>({})
    const [secretLoading, setSecretLoading] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false) // Tooltip is controlled because it needs to be programatically closed.

    useEffect(() => {
        loadAssignedSecrets()
    }, [secrets])

    useEffect(() => {
        if (registered && !hasAllSecrets) {
            unregister(item, false)
        }
    }, [registered])

    const hasAllSecrets = assignedSecrets.every(s => s.assigned)
    const hasDDVersionWithSecretSupport = ddVersion && ddVersion.build >= DD_BUILD_WITH_SECRET_SUPPORT;

    return (
        <>
            <Dialog open={showSecretDialog} onClose={() => setShowSecretDialog(false)}>
                <DialogTitle>
                    <Typography variant="h6">
                        Secrets
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        {assignedSecrets?.map(secret => (
                            <Stack key={secret.name} direction="row" spacing={2} alignItems="center">
                                <TextField placeholder={assignedSecrets.find(s => s.name === secret.name)?.assigned ? '********' : 'Enter secret value'} type="password" key={secret.name} label={secret.name} value={changedSecrets[secret.name] || ''} onChange={(event) => setChangedSecrets({ ...changedSecrets, [secret.name]: event.target.value })} />
                                {assignedSecrets.find(s => s.name === secret.name)?.assigned && changedSecrets[secret.name] && <IconButton onClick={() => setChangedSecrets({ ...changedSecrets, [secret.name]: undefined })}>
                                    <LockReset />
                                </IconButton>}
                                {changedSecrets[secret.name] && <IconButton onClick={() => {
                                    setSecretLoading(true)
                                    onSecretChange({ name: secret.name, value: changedSecrets[secret.name] || '' }).then(() => {
                                        setSecretLoading(false)
                                        const newChangedSecrets = { ...changedSecrets }
                                        delete newChangedSecrets[secret.name]
                                        setChangedSecrets(newChangedSecrets)
                                    })
                                }}>
                                    {secretLoading ? <CircularProgress size={20} /> : <Save />}
                                </IconButton>}
                            </Stack>
                        ))}
                    </Stack>
                </DialogContent>
            </Dialog>
            <Card sx={(theme) => ({ height: 150, borderColor: registered ? theme.palette.docker.grey[600] : theme.palette.docker.grey[300], borderWidth: registered ? 1 : 0.5 })} variant="outlined" >
                <Stack direction="column" height="100%" sx={{ justifyContent: 'space-between' }}>
                    <CardContent sx={{ p: 2, paddingBottom: 1, '&:hover .hover-underline': { textDecoration: 'underline' } }}>
                        <Stack onClick={openUrl} direction="row" spacing={1} justifyContent="space-between" sx={{ cursor: 'pointer' }}>
                            <Stack direction="column" spacing={1} >
                                <Typography className="hover-underline" gutterBottom component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: '1.2em' }}>
                                    {item.name.replace('_', ' ')}
                                </Typography>
                                <Tooltip title={item.description}>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        {item.description?.slice(0, 70)}...
                                    </Typography>
                                </Tooltip>

                            </Stack>
                            <CardMedia
                                component="img"
                                sx={{ width: 50, height: 50, padding: 1, background: 'white', borderRadius: 1, boxSizing: 'border-box', mt: -1 }}
                                alt={`Icon for ${item.name}`}
                                image={item.icon}
                            />
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ padding: 2, paddingTop: 0 }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Tooltip title="Prompts">
                                    <Badge badgeContent={item.prompts || "0"} color="primary">
                                        <Article sx={{ fontSize: iconSize }} />
                                    </Badge>
                                </Tooltip>
                                <Tooltip title="Resources">
                                    <Badge badgeContent={item.resources?.length || "0"} color="secondary">
                                        <AttachFile sx={{ fontSize: iconSize }} />
                                    </Badge>
                                </Tooltip>
                                <Tooltip title="Tools">
                                    <Badge badgeContent={item.tools?.length || "0"} color="success">
                                        <Build sx={{ fontSize: iconSize }} />
                                    </Badge>
                                </Tooltip>
                                {item.secrets?.length && (hasDDVersionWithSecretSupport ? (
                                    <Tooltip title={
                                        <Stack sx={{ pr: 1 }} direction="column" spacing={1}>
                                            <List subheader={<Typography sx={{ fontWeight: 'bold' }}>Expected secrets:</Typography>} dense sx={{ p: 0 }}>
                                                {item.secrets.map(secret => (
                                                    <ListItem key={secret.name}>
                                                        <ListItemIcon>
                                                            {assignedSecrets.find(s => s.name === secret.name)?.assigned ? <LockRounded sx={{ color: 'success.main' }} /> : <NoEncryptionGmailerrorred sx={{ color: 'warning.main' }} />}
                                                        </ListItemIcon>
                                                        <ListItemText primary={secret.name} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <Typography variant="caption">Click to set secrets</Typography>
                                        </Stack>
                                    }>
                                        <IconButton onClick={() => setShowSecretDialog(!showSecretDialog)}>
                                            <Badge badgeContent={item.secrets?.length || "0"} color={assignedSecrets?.every(s => s.assigned) ? 'success' : 'warning'}>
                                                <LockRounded sx={{ fontSize: iconSize }} />
                                            </Badge>
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title={getUnsupportedSecretMessage(ddVersion)}>
                                        <IconButton>
                                            <LockRounded sx={{ fontSize: iconSize }} />
                                        </IconButton>
                                    </Tooltip>
                                ))}
                            </Stack>
                            <Tooltip open={tooltipOpen} onClose={() => setTooltipOpen(false)} onOpen={() => setTooltipOpen(true)} title={hasAllSecrets ? registered ? "Blocking this tile will remove its tools, resources and prompts from being used in any MCP clients you have connected." : "Allowing this tile will expose its tools, resources and prompts to any MCP clients you have connected." : "You need to set all expected secrets to allow this tile."}>
                                {!hasAllSecrets ? <LockRounded /> : isRegistering ? <CircularProgress size={20} /> : <Switch
                                    size="small"
                                    color={registered ? 'success' : 'primary'}
                                    checked={registered && hasAllSecrets}
                                    onChange={() => {
                                        setTooltipOpen(false)
                                        trackEvent('registry-changed', { name: item.name, ref: item.ref, action: registered ? 'remove' : 'add' });
                                        setIsRegistering(true)
                                        if (registered) {
                                            unregister(item).then(() => {
                                                setIsRegistering(false)
                                            })
                                        } else {
                                            register(item).then(() => {
                                                setIsRegistering(false)
                                            })
                                        }

                                    }}
                                    disabled={!canRegister || isRegistering}
                                />}
                            </Tooltip>
                        </Stack>

                    </CardActions>
                </Stack>
            </Card >
        </>
    )
}