import { Tooltip, Typography } from "@mui/material";
import { CatalogItemWithName } from "../../types"
import { TILE_DESCRIPTION_MAX_LENGTH } from "../../Constants";

type CenterProps = {
    item: CatalogItemWithName;
}

export default function Center({ item }: CenterProps) {
    return (
        <Tooltip title={item.description} sx={{ height: '100%' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', height: 35 }}>
                {item.description?.slice(0, TILE_DESCRIPTION_MAX_LENGTH)}
                {item.description?.length && item.description.length > TILE_DESCRIPTION_MAX_LENGTH && '...'}
            </Typography>
        </Tooltip>
    )
}