import { Chip, Stack } from "@mui/material";
import { CatalogItem } from "../../types/catalog";
import { Hardware } from "@mui/icons-material";

type BottomProps = {
    item: CatalogItem,
    needsConfiguration: boolean
}

const Bottom = ({ item }: BottomProps) => {
    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {<Chip sx={{ fontSize: '1.2em', p: '4px 8px' }} label={
                <Stack direction="row" alignItems="center" sx={{ fontSize: '1.2em' }}>
                    <Hardware sx={{ fontSize: '1.2em', mr: '2px' }} />
                    {item.tools?.length || 1}
                </Stack>
            } color="primary" />}
            {!item.tools?.length && !!item.prompts && <Chip label={`${item.prompts} prompt` + (item.prompts !== 1 ? 's' : '')} color="secondary" />}
            {!item.tools?.length && !item.prompts && item.resources?.length && <Chip label={`${item.resources.length} resource(s)`} color="success" />}
        </Stack>

    )
}

export default Bottom;