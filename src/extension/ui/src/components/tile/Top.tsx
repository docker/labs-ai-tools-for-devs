import { CardMedia, Stack, Switch, Tooltip, Typography } from "@mui/material";
import { CatalogItemRichened } from "../../types/catalog";

type TopProps = {
    onToggleRegister: (checked: boolean) => void,
    item: CatalogItemRichened
}

export default function Top({ item, onToggleRegister }: TopProps) {

    const getActionButton = () => {
        if (!item.canRegister) {
            return <Stack direction="row" spacing={0} alignItems="center">
                <Tooltip title="This tile needs configuration before it can be used.">
                    <span>
                        <Switch checked={false} disabled />
                    </span>
                </Tooltip>
            </Stack>
        }
        return <Stack direction="row" spacing={0} alignItems="center">
            <Tooltip title={item.registered ? "Unregistering this tile will hide it from MCP clients." : "Registering this tile will expose it to MCP clients."}>
                <Switch
                    checked={item.registered}
                    onChange={(event, checked) => {
                        event.stopPropagation()
                        event.preventDefault()
                        onToggleRegister(checked)
                    }}
                />
            </Tooltip>
        </Stack>
    }
    return (
        <Stack direction="row" spacing={0} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1.5 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <CardMedia
                    component="img"
                    image={item.icon}
                    alt={item.name}
                    sx={{ width: 25, height: 25, borderRadius: 1, background: 'white', padding: '2px', justifySelf: 'flex-start' }}
                />
                <Typography sx={{ justifySelf: 'flex-start', fontWeight: 'bold' }}>{item.name}</Typography>
            </Stack>
            {getActionButton()}
        </Stack>
    )
}
