import { CircularProgress, Stack } from "@mui/material";
import Button from '@mui/material/Button';


import { Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Ref } from "../Refs";
import { useState } from "react";

export interface CatalogItem {
    description?: string;
    icon?: string;
    ref: string;
}

export interface CatalogItemWithName extends CatalogItem {
    name: string;
}

export function CatalogItemCard({ openUrl, item, canRegister, registered, register, unregister }: { openUrl: () => void, item: CatalogItemWithName, canRegister: boolean, registered: boolean, register: (item: CatalogItemWithName) => Promise<void>, unregister: (item: CatalogItemWithName) => Promise<void> }) {
    const [isRegistering, setIsRegistering] = useState(false)
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
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
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                    {item.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => {
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
            </CardActions>
        </Card >
    )
}