import { v1 } from '@docker/extension-api-client-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Collapse, Grid2, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { CATALOG_LAYOUT_SX } from '../../Constants';
import { useCatalogAll } from '../../queries/useCatalog';
import Tile from '../tile/Index';

interface ToolCatalogProps {
  search: string;
  client: v1.DockerDesktopClient;
  sort: 'name-asc' | 'name-desc';
}

const ToolCatalog: React.FC<ToolCatalogProps> = ({
  search,
  client,
  sort,
}) => {
  const { catalogItems, registryLoading } = useCatalogAll(client);
  const [expandedEnabled, setExpandedEnabled] = useState(localStorage.getItem('expandedEnabled') !== 'false');
  const [expandedNotEnabled, setExpandedNotEnabled] = useState(localStorage.getItem('expandedNotEnabled') !== 'false');

  // Memoize the filtered catalog items to prevent unnecessary recalculations
  const all = useMemo(() => {
    const filteredItems = catalogItems.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
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
  }, [catalogItems, search, sort]);
  const enabled = all.filter((item) => item.registered);

  return (
    <>
      {(enabled.length > 0) && (
        <>
          <Typography
            variant='subtitle2'
            sx={{ color: "text.secondary", display: "flex", alignItems: "center", cursor: "pointer", width: 'fit-content' }}
            onClick={() => {
              const newExpanded = !expandedEnabled
              setExpandedEnabled(newExpanded);
              localStorage.setItem('expandedEnabled', JSON.stringify(newExpanded));
            }}>
            {`Enabled (${enabled.length})`}
            {expandedEnabled ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </Typography >

          <Collapse in={expandedEnabled}>
            <Grid2 container spacing={1} sx={CATALOG_LAYOUT_SX}>
              {enabled.map((catalogItem) => {
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
          </Collapse>
        </>
      )}

      <Typography
        variant='subtitle2'
        sx={{ color: "text.secondary", display: "flex", alignItems: "center", cursor: "pointer", width: 'fit-content' }}
        onClick={() => {
          const newExpanded = !expandedNotEnabled
          setExpandedNotEnabled(newExpanded);
          localStorage.setItem('expandedNotEnabled', JSON.stringify(newExpanded));
        }}>
        {`All (${all.length})`}
        {expandedNotEnabled ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
      </Typography>

      <Collapse in={expandedNotEnabled}>
        <Grid2 container spacing={1} sx={CATALOG_LAYOUT_SX}>
          {all.map((catalogItem) => {
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
      </Collapse>
    </>
  );
};

export default React.memo(ToolCatalog);
