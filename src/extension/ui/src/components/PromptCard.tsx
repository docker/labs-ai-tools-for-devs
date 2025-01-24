import { Button, Stack } from "@mui/material";

import { Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Ref } from "../Refs";

export interface CatalogItem {
    description?: string;
    icon?: string;
    ref: string;
}

export interface CatalogItemWithName extends CatalogItem {
    name: string;
}

export function CatalogItemCard({ openUrl, item, canRegister, registered, register, unregister }: { openUrl: () => void, item: CatalogItemWithName, canRegister: boolean, registered: boolean, register: (item: CatalogItemWithName) => void, unregister: (item: CatalogItemWithName) => void }) {
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
                    onClick={() => canRegister ? (registered ? unregister(item) : register(item)) : null}
                    disabled={!canRegister}
                >
                    {registered ? 'Remove' : 'Add'}
                </Button>
            </CardActions>
        </Card >
    )
}