import React, { useMemo } from 'react';
import { Grid2 } from '@mui/material';
import Tile from '../tile/Index';
import { v1 } from '@docker/extension-api-client-types';
import { CATALOG_LAYOUT_SX } from '../../Constants';
import { useCatalogAll } from '../../queries/useCatalog';

interface ToolCatalogProps {
  search: string;
  client: v1.DockerDesktopClient;
  showMine: boolean;
  sort: 'name-asc' | 'name-desc';
}

const ToolCatalog: React.FC<ToolCatalogProps> = ({
  search,
  client,
  showMine,
  sort,
}) => {
  const { catalogItems, registryLoading } = useCatalogAll(client);

  // Memoize the filtered catalog items to prevent unnecessary recalculations
  const result = useMemo(() => {
    const filteredItems = catalogItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const hideBecauseItsNotMine = showMine && !item.registered;
      return matchesSearch && !hideBecauseItsNotMine;
    });

    return sort === 'name-asc'
      ? filteredItems.sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
      : sort === 'name-desc'
      ? filteredItems.sort((a, b) => {
          return b.name.localeCompare(a.name);
        })
      : filteredItems;
  }, [catalogItems, search, showMine, sort]);

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
