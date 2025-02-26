import { Badge, CircularProgress, Stack, Tooltip } from "@mui/material";
import Button from '@mui/material/Button';
import { Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Ref } from "../Refs";
import { useState } from "react";
import { trackEvent } from "../Usage";
import { Article, AttachFile, Build, LockRounded } from "@mui/icons-material";

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

export function CatalogItemCard({ openUrl, item, canRegister, registered, register, unregister }: { openUrl: () => void, item: CatalogItemWithName, canRegister: boolean, registered: boolean, register: (item: CatalogItemWithName) => Promise<void>, unregister: (item: CatalogItemWithName) => Promise<void> }) {
    const [isRegistering, setIsRegistering] = useState(false)
    return (
        <Card sx={(theme) => ({ height: '100%', borderColor: registered ? theme.palette.docker.grey[600] : theme.palette.docker.grey[400], borderWidth: registered ? 2 : 1 })} variant="outlined" >
            <Stack direction="column" height="100%" sx={{ justifyContent: 'space-between' }}>
                <CardContent>
                    <a href="">
                        <Stack onClick={openUrl} direction="row" spacing={2} justifyContent="space-between" sx={{ cursor: 'pointer' }}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                {item.name.replace('_', ' ')}
                            </Typography>
                            <CardMedia
                                component="img"
                                sx={{ width: 50, height: 50, padding: 1, background: 'white', borderRadius: 1 }}
                                alt={`Icon for ${item.name}`}
                                image={item.icon}
                            />
                        </Stack>
                    </a>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {item.description}
                    </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Stack direction="row" spacing={2}>
                            <Tooltip title="Prompts">
                                <Badge badgeContent={item.prompts || "0"} color="primary">
                                    <Article />
                                </Badge>
                            </Tooltip>
                            <Tooltip title="Resources">
                                <Badge badgeContent={item.resources?.length || "0"} color="secondary">
                                    <AttachFile />
                                </Badge>
                            </Tooltip>
                            <Tooltip title="Tools">
                                <Badge badgeContent={item.tools?.length || "0"} color="success">
                                    <Build />
                                </Badge>
                            </Tooltip>
                            {item.secrets?.length && (
                                <Tooltip title={<Stack sx={{ pr: 1 }} direction="column" spacing={1}>
                                    <Typography sx={{ fontWeight: 'bold' }}>Expected secrets:</Typography>
                                    {item.secrets.map(secret => (
                                        <Typography key={secret.name}>{secret.name}</Typography>
                                    ))}
                                </Stack>}>
                                    <Badge badgeContent={item.secrets?.length || "0"} color="warning">
                                        <LockRounded />
                                    </Badge>
                                </Tooltip>
                            )}
                        </Stack>
                        <Button
                            size="small"
                            color={registered ? 'error' : 'primary'}
                            variant={registered ? 'outlined' : 'contained'}
                            onClick={() => {
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
                        >
                            {isRegistering ? <CircularProgress size={20} /> : registered ? 'Block' : 'Allow'}
                        </Button>
                    </Stack>

                </CardActions>
            </Stack>
        </Card >
    )
}