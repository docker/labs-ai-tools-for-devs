import { Settings } from "@mui/icons-material";
import { Badge, CardMedia, IconButton, Stack, Switch, Tooltip, Typography } from "@mui/material";
import { getUnsupportedSecretMessage } from "../../Constants";
import { CatalogItemWithName } from "../../types/catalog";
import { useConfigContext } from "../../context/ConfigContext";

type TopProps = {
    unAssignedConfig: { name: string, assigned: boolean }[],
    onToggleRegister: (checked: boolean) => void,
    unAssignedSecrets: { name: string, assigned: boolean }[],
    registered: boolean
    item: CatalogItemWithName
}

export default function Top({ item, unAssignedConfig, onToggleRegister, unAssignedSecrets, registered }: TopProps) {

    const hasAllSecrets = unAssignedSecrets.length === 0


    const { config } = useConfigContext()

    const missingConfig = !config?.[item.name]

    const getActionButton = () => {
        if (!hasAllSecrets || missingConfig) {
            return <Stack direction="row" spacing={0} alignItems="center">
                <Tooltip title="This tile needs configuration before it can be used.">
                    <span>
                        <Switch checked={false} disabled />
                    </span>
                </Tooltip>
            </Stack>
        }
        return <Stack direction="row" spacing={0} alignItems="center">
            <Tooltip title={registered ? "Unregistering this tile will hide it from MCP clients." : "Registering this tile will expose it to MCP clients."}>
                <Switch
                    checked={registered}
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
