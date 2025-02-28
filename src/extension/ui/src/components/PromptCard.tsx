import { Badge, CircularProgress, Stack, Switch, Tooltip } from "@mui/material";
import Button from '@mui/material/Button';
import { Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Ref } from "../Refs";
import { useState } from "react";
import { trackEvent } from "../Usage";
import { Article, AttachFile, Build, LockRounded } from "@mui/icons-material";

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

export function CatalogItemCard({ openUrl, item, canRegister, registered, register, unregister }: { openUrl: () => void, item: CatalogItemWithName, canRegister: boolean, registered: boolean, register: (item: CatalogItemWithName) => Promise<void>, unregister: (item: CatalogItemWithName) => Promise<void> }) {
    const [isRegistering, setIsRegistering] = useState(false)
    return (
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
                        <Stack direction="row" spacing={2} >
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
                            {item.secrets?.length && (
                                <Tooltip title={<Stack sx={{ pr: 1 }} direction="column" spacing={1}>
                                    <Typography sx={{ fontWeight: 'bold' }}>Expected secrets:</Typography>
                                    {item.secrets.map(secret => (
                                        <Typography key={secret.name}>{secret.name}</Typography>
                                    ))}
                                </Stack>}>
                                    <Badge badgeContent={item.secrets?.length || "0"} color="warning">
                                        <LockRounded sx={{ fontSize: iconSize }} />
                                    </Badge>
                                </Tooltip>
                            )}
                        </Stack>
                        <Tooltip title={registered ? "Blocking this tile will remove its tools, resources and prompts from being used in any MCP clients you have connected." : "Allowing this tile will expose its tools, resources and prompts to any MCP clients you have connected."}>
                            {isRegistering ? <CircularProgress size={20} /> : <Switch
                                size="small"
                                color={registered ? 'success' : 'primary'}
                                checked={registered}
                                onChange={(event, checked) => {
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
    )
}