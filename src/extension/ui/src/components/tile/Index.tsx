import { v1 } from '@docker/extension-api-client-types';
import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useCatalogOperations } from '../../queries/useCatalog';
import { useSecrets } from '../../queries/useSecrets';
import type { CatalogItemRichened } from '../../types/catalog';
import Bottom from './Bottom';
import Center from './Center';
import Top from './Top';

type TileProps = {
  item: CatalogItemRichened;
  client: v1.DockerDesktopClient;
  registryLoading: boolean;
  setSelectedItem: (item: CatalogItemRichened) => void;
  setShowConfigModal: (show: boolean) => void;
};

const Tile = ({
  item,
  client,
  registryLoading,
  setSelectedItem,
  setShowConfigModal,
}: TileProps) => {
  const { isLoading: secretsLoading } = useSecrets(client);
  const { registerCatalogItem, unregisterCatalogItem } =
    useCatalogOperations(client);

  if (registryLoading || secretsLoading) {
    return (
      <>
        <CircularProgress size={20} />
        <Typography>Loading registry...</Typography>
      </>
    );
  }

  return (
    <Card>
      <CardActionArea
        sx={{ padding: 1.5 }}
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName !== 'INPUT') {
            setShowConfigModal(true);
            setSelectedItem(item);
          }
        }}
      >
        <Top
          onToggleRegister={(checked) => {
            if (checked) {
              registerCatalogItem(item);
            } else {
              unregisterCatalogItem(item);
            }
          }}
          item={item}
        />
        <CardContent sx={(th) => ({ padding: th.spacing(2, 0, 0) })}>
          <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Center item={item} />
            <Bottom item={item} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Tile;
