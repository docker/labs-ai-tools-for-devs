import { Badge, CircularProgress, Stack, Tooltip } from "@mui/material";
import Button from '@mui/material/Button';
import { Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Ref } from "../Refs";
import { useState } from "react";
import { trackEvent } from "../Usage";
import { Article, AttachFile, Build } from "@mui/icons-material";

export interface CatalogItem {
    description?: string;
    icon?: string;
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
        <Card sx={{ height: '100%' }}>
            <Stack direction="column" height="100%" sx={{ justifyContent: 'space-between' }}>
                <CardContent>
                    <a href="">
                        <Stack onClick={openUrl} direction="row" spacing={2} justifyContent="space-between" sx={{ cursor: 'pointer' }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {item.name}
                            </Typography>
                            <CardMedia
                                component="img"
                                sx={{ maxWidth: 100, padding: 1, background: 'white', borderRadius: 1 }}
                                alt={`Icon for ${item.name}`}
                                image={item.icon}
                            />
                        </Stack>
                    </a>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                        {item.description}
                    </Typography>
                </CardContent>
                <CardActions>
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

                        </Stack>
                        <Button
                            size="small"
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
                            {isRegistering ? <CircularProgress size={20} /> : registered ? 'Remove' : 'Add'}
                        </Button>
                    </Stack>

                </CardActions>
            </Stack>
        </Card >
    )
}