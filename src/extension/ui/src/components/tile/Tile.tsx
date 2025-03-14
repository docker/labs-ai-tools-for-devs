import { CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
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
    openUrl: () => void;
    item: CatalogItemWithName;
    registered: boolean;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secrets.Secret[];
    ActionsSlot: ReactNode
}

const Tile = ({ openUrl, item, registered, onSecretChange, secrets, ActionsSlot }: TileProps) => {
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
                    <CardActions sx={{ padding: 1, paddingTop: 0 }}>
                        {ActionsSlot}
                    </CardActions>
                </Stack >
            </Card >
        </>
    )
}

export default Tile;