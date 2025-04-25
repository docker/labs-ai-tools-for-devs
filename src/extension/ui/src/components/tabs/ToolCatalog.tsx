import React, { useMemo } from 'react';
import { Grid2 } from '@mui/material';
import Tile from '../tile/Index';
import { v1 } from '@docker/extension-api-client-types';
import { partition } from 'lodash-es';

import { CATALOG_LAYOUT_SX } from '../../Constants';
import { useCatalogAll } from '../../queries/useCatalog';
import type { CatalogItemRichened } from '../../types';

interface ToolCatalogProps {
  search: string;
  client: v1.DockerDesktopClient;
  sort: 'name-asc' | 'name-desc';
}

function sortItems(
  items: CatalogItemRichened[],
  sort: 'name-asc' | 'name-desc'
) {
  if (sort === 'name-asc') {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }
  return items.sort((a, b) => b.name.localeCompare(a.name));
}

const ToolCatalog: React.FC<ToolCatalogProps> = ({ search, client, sort }) => {
  const { catalogItems, registryLoading } = useCatalogAll(client);

  // Memoize the filtered catalog items to prevent unnecessary recalculations
  const result = useMemo(() => {
    if (search === '') {
      return catalogItems;
    }

    const matchedSearch = catalogItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    const [enabledItems, disabledItems] = partition(matchedSearch, (item) => {
      return item.registered === true;
    });

    return [
      ...sortItems(enabledItems, sort),
      ...sortItems(disabledItems, sort),
    ];
  }, [catalogItems, search, sort]);

  return (
    <Grid2 container spacing={1} sx={CATALOG_LAYOUT_SX}>
      {result.map((catalogItem) => {
        return (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={catalogItem.name}>
            <Tile
              item={catalogItem}
              client={client}
              registryLoading={registryLoading}
            />
          </Grid2>
        );
      })}
    </Grid2>
  );
};

export default React.memo(ToolCatalog);
