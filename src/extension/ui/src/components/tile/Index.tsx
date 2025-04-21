import { CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { CatalogItemWithName } from "../../types/catalog";
import { Save, LockReset } from "@mui/icons-material";
import Secrets from "../../Secrets";
import ConfigurationModal from "./Modal";
import Top from "./Top";
import Center from "./Center";
import Bottom from "./Bottom";
import { Secret } from "../../types";
import { v1 } from "@docker/extension-api-client-types";

type TileProps = {
    item: CatalogItemWithName;
    registered: boolean;
    onSecretChange: (secret: { name: string, value: string }) => Promise<void>;
    secrets: Secret[];
    client: v1.DockerDesktopClient;
    unAssignedConfig: { name: string; assigned: boolean }[];
}

const Tile = ({ item, registered, onSecretChange, secrets, client, unAssignedConfig }: TileProps) => {
    const loadAssignedSecrets = () => {
        const assignedSecrets = Secrets.getSecretsWithAssignment(item, secrets);
        setAssignedSecrets(assignedSecrets)
    }

    const [showSecretDialog, setShowSecretDialog] = useState(false)
    const [assignedSecrets, setAssignedSecrets] = useState<{ name: string, assigned: boolean }[]>([])
    const [changedSecrets, setChangedSecrets] = useState<{ [key: string]: string | undefined }>({})
    const [secretLoading, setSecretLoading] = useState(false)

    const { registryLoading, registerCatalogItem, unregisterCatalogItem } = useCatalogContext()
    const [showConfigModal, setShowConfigModal] = useState(false)

    useEffect(() => {
        loadAssignedSecrets()
    }, [secrets])

    if (registryLoading) {
        return <>
            <CircularProgress size={20} />
            <Typography>Loading registry...</Typography>
        </>
    }

    const unAssignedSecrets = assignedSecrets.filter(s => !s.assigned)

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
            <ConfigurationModal
                open={showConfigModal}
                onClose={() => setShowConfigModal(false)}
                catalogItem={item}
                client={client}
                registered={registered}
                onToggleRegister={(checked) => {
                    if (checked) {
                        registerCatalogItem(item)
                    } else {
                        unregisterCatalogItem(item)
                    }
                }}
                onSecretChange={onSecretChange}
            />
            <Card onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'INPUT') {
                    setShowConfigModal(true)
                }
            }} sx={{ height: 150, borderColor: 'divider', borderWidth: 1, borderStyle: 'solid', p: 0, cursor: 'pointer', transition: 'background-color 0.1s ease', '&:hover': { backgroundColor: 'action.hover' } }} >
                <CardContent sx={{ paddingBottom: 0, paddingTop: 2 }}>
                    <Stack direction="column" spacing={0}>
                        <Top onToggleRegister={(checked) => {
                            if (checked) {
                                registerCatalogItem(item)
                            } else {
                                unregisterCatalogItem(item)
                            }
                        }} item={item} unAssignedConfig={unAssignedConfig} unAssignedSecrets={unAssignedSecrets} registered={registered} />
                        <Center item={item} />
                        <Divider sx={{ marginBottom: 1 }} />
                        <Bottom item={item} needsConfiguration={Boolean(unAssignedSecrets.length || unAssignedConfig.length)} />
                    </Stack>
                </CardContent>
            </Card >
        </>
    )
}

export default Tile;