import { Box, Chip, Stack, Typography } from "@mui/material";
import { CatalogItem } from "../../types/catalog";
import { Hardware, WarningAmberOutlined } from "@mui/icons-material";

type BottomProps = {
    item: CatalogItem,
    needsConfiguration: boolean
}

const Bottom = ({ item, needsConfiguration }: BottomProps) => {
    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {<Chip label={
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '1.2em' }}>
                    <Hardware sx={{ fontSize: '1.2em' }} />
                    {`${(item.tools || []).length || 1} tool` + ((item.tools || []).length || 1 !== 1 ? 's' : '')}

                </Stack>
            } color="primary" />}
            {!item.tools?.length && !!item.prompts && <Chip label={`${item.prompts} prompt` + (item.prompts !== 1 ? 's' : '')} color="secondary" />}
            {!item.tools?.length && !item.prompts && item.resources?.length && <Chip label={`${item.resources.length} resource(s)`} color="success" />}
        </Stack>

    )
}

export default Bottom;