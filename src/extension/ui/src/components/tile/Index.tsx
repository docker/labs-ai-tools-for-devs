import { v1 } from '@docker/extension-api-client-types';
import LockReset from '@mui/icons-material/LockReset';
import Save from '@mui/icons-material/Save';
import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

import { MCP_POLICY_NAME } from '../../Constants';
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
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [assignedSecrets] = useState<{ name: string; assigned: boolean }[]>([]);
  const [changedSecrets, setChangedSecrets] = useState<{
    [key: string]: string | undefined;
  }>({});
  const [secretLoading, setSecretLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const { isLoading: secretsLoading, mutate: mutateSecret } =
    useSecrets(client);
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
      <Dialog
        open={showSecretDialog}
        onClose={() => setShowSecretDialog(false)}
      >
        <DialogTitle>
          <Typography variant="h6">Secrets</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            {assignedSecrets?.map((secret) => {
              const isAssigned = assignedSecrets.find(
                (s) => s.name === secret.name
              );
              return (
                <Stack
                  key={secret.name}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2">
                    {secret.name}{' '}
                    {isAssigned?.assigned ? 'assigned' : 'not assigned'}
                  </Typography>
                  <TextField
                    placeholder={
                      isAssigned?.assigned ? '********' : 'Enter secret value'
                    }
                    type="password"
                    key={secret.name}
                    label={secret.name}
                    value={changedSecrets[secret.name] || ''}
                    onChange={(event) =>
                      setChangedSecrets({
                        ...changedSecrets,
                        [secret.name]: event.target.value,
                      })
                    }
                  />
                  {isAssigned?.assigned && changedSecrets[secret.name] && (
                    <IconButton
                      onClick={() =>
                        setChangedSecrets({
                          ...changedSecrets,
                          [secret.name]: undefined,
                        })
                      }
                    >
                      <LockReset />
                    </IconButton>
                  )}
                  {changedSecrets[secret.name] && (
                    <IconButton
                      onClick={() => {
                        setSecretLoading(true);
                        mutateSecret
                          .mutateAsync({
                            name: secret.name,
                            value: changedSecrets[secret.name] || '',
                            policies: [MCP_POLICY_NAME],
                          })
                          .then(() => {
                            setSecretLoading(false);
                            const newChangedSecrets = { ...changedSecrets };
                            delete newChangedSecrets[secret.name];
                            setChangedSecrets(newChangedSecrets);
                          });
                      }}
                    >
                      {secretLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Save />
                      )}
                    </IconButton>
                  )}
                </Stack>
              );
            })}
          </Stack>
        </DialogContent>
      </Dialog>
      {showConfigModal && <ConfigurationModal
        open={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        catalogItem={item}
        client={client}
      />}
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
