import { v1 } from '@docker/extension-api-client-types';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import Close from '@mui/icons-material/Close';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Launch from '@mui/icons-material/Launch';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ASSIGNED_SECRET_PLACEHOLDER, MCP_POLICY_NAME } from '../../Constants';
import { useCatalogOperations } from '../../queries/useCatalog';
import { useConfig } from '../../queries/useConfig';
import { useSecrets } from '../../queries/useSecrets';
import { CatalogItemRichened } from '../../types/catalog';
import ConfigEditor from './ConfigEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`configuration-tabpanel-${index}`}
      aria-labelledby={`configuration-tab-${index}`}
      {...other}
      style={{ padding: '16px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface ConfigurationModalProps {
  open: boolean;
  onClose: () => void;
  catalogItem: CatalogItemRichened;
  client: v1.DockerDesktopClient;
  registryLoading: boolean;
}

const ConfigurationModal = ({
  open,
  onClose,
  catalogItem,
  client,
  registryLoading,
}: ConfigurationModalProps) => {
  const [localSecrets, setLocalSecrets] = useState<
    { [key: string]: string | undefined } | undefined
  >(undefined);
  const theme = useTheme();

  const { isLoading: secretsLoading, mutate: mutateSecret } =
    useSecrets(client);
  const { registerCatalogItem, unregisterCatalogItem } =
    useCatalogOperations(client);
  const { configLoading } = useConfig(client);

  useEffect(() => {
    setLocalSecrets(
      catalogItem.secrets.reduce((acc, secret) => {
        acc[secret.name] = secret.assigned ? ASSIGNED_SECRET_PLACEHOLDER : '';
        return acc;
      }, {} as { [key: string]: string | undefined })
    );
  }, [catalogItem.secrets]);

  const toolChipStyle = {
    padding: '2px 8px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    color: theme.palette.docker.grey[700],
    background: theme.palette.docker.grey[100],
    border: 1,
    borderColor: theme.palette.docker.grey[200],
    textAlign: 'center',
    borderRadius: 4,
    fontFamily: 'Roboto Mono',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 400,
    width: 'fit-content',
  };

  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const contributesNoConfigOrSecrets =
    (!catalogItem.configSchema || catalogItem.configSchema.length === 0) &&
    (!catalogItem.secrets || catalogItem.secrets.length === 0);

  if (secretsLoading || registryLoading || configLoading || !localSecrets) {
    return null;
  }

  return (
    <Dialog
      open={open}
      // When onClose is defined, clicking outside the dialog should close it
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Avatar
            variant="square"
            src={catalogItem.icon}
            alt={catalogItem.name}
            sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
            }}
          />
          {catalogItem.name}

          <Tooltip
            placement="right"
            title={
              !catalogItem.canRegister
                ? 'You must assign all secrets and configure the item before it can be used.'
                : ''
            }
          >
            <span>
              <Switch
                disabled={!catalogItem.canRegister}
                checked={catalogItem.registered}
                onChange={(e) =>
                  catalogItem.registered
                    ? unregisterCatalogItem(catalogItem)
                    : registerCatalogItem(catalogItem)
                }
              />
            </span>
          </Tooltip>
        </Stack>
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
        size="small"
      >
        <Close fontSize="small" />
      </IconButton>
      <DialogContent dividers>
        <Typography
          sx={{ overflow: 'auto', color: 'text.secondary' }}
          variant="body2"
        >
          {catalogItem.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Repository:{' '}
          <Link
            onClick={() => client.host.openExternal(catalogItem.source || '')}
            href={catalogItem.source || ''}
            target="_blank"
          >
            {catalogItem.source || ''}
            <Launch />
          </Link>
        </Typography>

        {configLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress />
              <Typography>Loading config...</Typography>
            </Stack>
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Tools" />
                {!contributesNoConfigOrSecrets && (
                  <Tab
                    disabled={contributesNoConfigOrSecrets}
                    label={
                      <Badge
                        invisible={catalogItem.canRegister}
                        sx={{ pl: 1, pr: 1 }}
                        variant="dot"
                        badgeContent={
                          catalogItem.config && catalogItem.config.length > 0
                            ? 'Secrets'
                            : 'Config'
                        }
                        color="error"
                      >
                        Config & Secrets
                      </Badge>
                    }
                  />
                )}
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              {!catalogItem?.tools?.length && (
                <Typography>No tools available for this item.</Typography>
              )}
              <Stack
                spacing={1}
                sx={{
                  overflow: 'auto',
                  maxHeight: 'calc(80vh - 200px)',
                  minHeight: '180px',
                }}
              >
                {(catalogItem.tools || []).map((tool) => (
                  <Typography
                    key={tool.name}
                    variant="body2"
                    sx={toolChipStyle}
                  >
                    {tool.name}
                  </Typography>
                ))}
              </Stack>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Stack
                spacing={1}
                sx={{
                  overflow: 'auto',
                  maxHeight: 'calc(80vh - 200px)',
                  minHeight: '180px',
                }}
              >
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{
                    border: '2px solid',
                    borderColor: theme.palette.warning.contrastText,
                    borderRadius: 2,
                    p: 2,
                    mt: 2,
                  }}
                >
                  <ConfigEditor catalogItem={catalogItem} client={client} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Secrets
                  </Typography>
                  {catalogItem.secrets && catalogItem.secrets?.length > 0 ? (
                    catalogItem.secrets.map((secret) => {
                      const secretEdited =
                        (secret.assigned &&
                          localSecrets[secret.name] !==
                            ASSIGNED_SECRET_PLACEHOLDER) ||
                        (!secret.assigned && localSecrets[secret.name] !== '');
                      return (
                        <Stack
                          key={secret.name}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <TextField
                            key={secret.name}
                            label={secret.name}
                            value={localSecrets[secret.name]}
                            fullWidth
                            onChange={(e) => {
                              setLocalSecrets({
                                ...localSecrets,
                                [secret.name]: e.target.value,
                              });
                            }}
                            type="password"
                          />
                          {secret.assigned && !secretEdited && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                mutateSecret.mutateAsync({
                                  name: secret.name,
                                  value: undefined,
                                  policies: [MCP_POLICY_NAME],
                                });
                              }}
                            >
                              <DeleteOutlined />
                            </IconButton>
                          )}
                          {secretEdited && (
                            <ButtonGroup>
                              <IconButton
                                onClick={async () => {
                                  await mutateSecret.mutateAsync({
                                    name: secret.name,
                                    value: localSecrets[secret.name]!,
                                    policies: [MCP_POLICY_NAME],
                                  });
                                }}
                              >
                                <CheckOutlined sx={{ color: 'success.main' }} />
                              </IconButton>
                              <IconButton
                                onClick={async () => {
                                  setLocalSecrets({
                                    ...localSecrets,
                                    [secret.name]: secret.assigned
                                      ? ASSIGNED_SECRET_PLACEHOLDER
                                      : '',
                                  });
                                }}
                              >
                                <CloseOutlined sx={{ color: 'error.main' }} />
                              </IconButton>
                            </ButtonGroup>
                          )}
                        </Stack>
                      );
                    })
                  ) : (
                    <Alert severity="info">
                      No secrets available for this item.
                    </Alert>
                  )}
                </Stack>
              </Stack>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography>Examples</Typography>
              WIP
            </TabPanel>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;
