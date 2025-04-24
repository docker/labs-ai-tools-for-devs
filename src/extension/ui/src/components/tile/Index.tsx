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
import { CatalogItemRichened } from '../../types/catalog';
import Bottom from './Bottom';
import Center from './Center';
import ConfigurationModal from './Modal';
import Top from './Top';

type TileProps = {
  item: CatalogItemRichened;
  client: v1.DockerDesktopClient;
  registryLoading: boolean;
};

const Tile = ({ item, client, registryLoading }: TileProps) => {
  const [assignedSecrets] = useState<{ name: string; assigned: boolean }[]>([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
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

  const unAssignedSecrets = assignedSecrets.filter((s) => !s.assigned);

  return (
    <>
      {showConfigModal && (
        <ConfigurationModal
          open={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          catalogItem={item}
          client={client}
          registryLoading={registryLoading}
        />
      )}
      <Card>
        <CardActionArea
          sx={{ padding: 1.5 }}
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName !== 'INPUT') {
              setShowConfigModal(true);
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
              <Bottom
                item={item}
                needsConfiguration={Boolean(unAssignedSecrets.length)}
              />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export default Tile;
