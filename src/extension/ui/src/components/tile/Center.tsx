import { Typography } from '@mui/material';

import type { CatalogItemRichened } from '../../types';

/*
  `Center` displays the description of the item in a truncated format.
  This should have been renamed to `Description`.
*/
export default function Center({ item }: { item: CatalogItemRichened }) {
  return (
    <Typography
      variant="body2"
      sx={{
        color: 'text.secondary',
        // These CSS properties are used to create a multiline ellipsis effect: 3 lines maximum for the description
        display: '-webkit-box',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: '3',
        height: 48,
      }}
    >
      {item.description ?? ''}
    </Typography>
  );
}
