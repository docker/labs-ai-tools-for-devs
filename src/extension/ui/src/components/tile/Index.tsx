import { CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { CatalogItemRichened } from "../../types/catalog";
import { Save, LockReset } from "@mui/icons-material";
import ConfigurationModal from "./Modal";
import Top from "./Top";
import Center from "./Center";
import Bottom from "./Bottom";
import { v1 } from "@docker/extension-api-client-types";
import { useSecrets } from "../../queries/useSecrets";
import { useCatalogOperations, useRegistry } from "../../queries/useCatalog";
import { MCP_POLICY_NAME } from "../../Constants";

type TileProps = {
    item: CatalogItemRichened;
    client: v1.DockerDesktopClient;
}

const Tile = ({ item, client }: TileProps) => {

    const [showSecretDialog, setShowSecretDialog] = useState(false)
    const [assignedSecrets] = useState<{ name: string, assigned: boolean }[]>([])
    const [changedSecrets, setChangedSecrets] = useState<{ [key: string]: string | undefined }>({})
    const [secretLoading, setSecretLoading] = useState(false)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const { isLoading: secretsLoading, mutate: mutateSecret } = useSecrets(client)
    const { registryLoading } = useRegistry(client)
    const { registerCatalogItem, unregisterCatalogItem } = useCatalogOperations(client)

    if (registryLoading || secretsLoading) {
        return <>
            <CircularProgress size={20} />
            <Typography>Loading registry...</Typography>
        </>
    }

    const unAssignedSecrets = assignedSecrets.filter(s => !s.assigned)

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
                                        mutateSecret.mutateAsync({ name: secret.name, value: changedSecrets[secret.name] || '', policies: [MCP_POLICY_NAME] }).then(() => {
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
                        }} item={item} />
                        <Center item={item} />
                        <Divider sx={{ marginBottom: 1 }} />
                        <Bottom item={item} needsConfiguration={Boolean(unAssignedSecrets.length)} />
                    </Stack>
                </CardContent>
            </Card >
        </>
    )
}

export default Tile;