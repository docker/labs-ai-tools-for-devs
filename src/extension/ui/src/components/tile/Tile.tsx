import { CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Secrets from "../../Secrets";
import { Config } from "../ConfigurationModal";
import { Save, LockReset } from "@mui/icons-material";


export interface CatalogItem {
    description?: string;
    icon?: string;
    secrets?: { name: string }[];
    ref: string;
    prompts: number;
    resources: object[];
    tools: object[];
    config?: Config;
}

export interface CatalogItemWithName extends CatalogItem {
    name: string;
}

export interface TileProps {
    item: CatalogItemWithName;
    registered: boolean;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secrets.Secret[];
    ActionsSlot: ReactNode
}

const Tile = ({ item, registered, onSecretChange, secrets, ActionsSlot }: TileProps) => {
    const loadAssignedSecrets = () => {
        const assignedSecrets = Secrets.getAssignedSecrets(item, secrets);
        setAssignedSecrets(assignedSecrets)
    }

    const [showSecretDialog, setShowSecretDialog] = useState(false)
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([])
    const [changedSecrets, setChangedSecrets] = useState<{ [key: string]: string | undefined }>({})
    const [secretLoading, setSecretLoading] = useState(false)

    useEffect(() => {
        loadAssignedSecrets()
    }, [secrets])

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
                        {assignedSecrets?.map(secret => {
                            const isAssigned = assignedSecrets.find(s => s.name === secret.name)
                            return (
                                <Stack key={secret.name} direction="row" spacing={2} alignItems="center">
                                    <Typography variant="body2">{secret.name} {isAssigned?.assigned ? 'assigned' : 'not assigned'}</Typography>
                                    <TextField placeholder={isAssigned?.assigned ? '********' : 'Enter secret value'} type="password" key={secret.name} label={secret.name} value={changedSecrets[secret.name] || ''} onChange={(event) => setChangedSecrets({ ...changedSecrets, [secret.name]: event.target.value })} />
                                    {isAssigned?.assigned && changedSecrets[secret.name] && <IconButton onClick={() => setChangedSecrets({ ...changedSecrets, [secret.name]: undefined })}>
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
                            )
                        })}
                    </Stack>
                </DialogContent>
            </Dialog>
            <Card sx={(theme) => ({ height: 140, borderColor: 'divider', borderWidth: 1, borderStyle: 'solid' })} >
                <Stack direction="column" height="100%" sx={{ justifyContent: 'space-between' }}>
                    <CardContent sx={{ paddingBottom: 0, paddingTop: 2 }}>
                        <Stack direction="column" spacing={0}>
                            <Stack direction="row" spacing={0} justifyContent="space-between">
                                <CardMedia
                                    component="img"
                                    sx={{ width: '3em', height: '3em', padding: 1, background: 'white', borderRadius: 1, boxSizing: 'border-box', mt: -1, ml: -1 }}
                                    alt={`Icon for ${item.name}`}
                                    image={item.icon}
                                />
                                <Typography gutterBottom component="div" sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                                    {item.name}
                                </Typography>
                            </Stack>
                            <Tooltip title={item.description}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', pt: 1 }}>
                                    {item.description?.slice(0, 70)}...
                                </Typography>
                            </Tooltip>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ px: 1.5, height: 30 }}>
                        {ActionsSlot}
                    </CardActions>
                </Stack >
            </Card >
        </>
    )
}

export default Tile;