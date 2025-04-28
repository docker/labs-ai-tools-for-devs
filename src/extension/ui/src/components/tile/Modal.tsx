import { v1 } from '@docker/extension-api-client-types';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import Close from '@mui/icons-material/Close';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Launch from '@mui/icons-material/Launch';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  ButtonGroup,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import {
  ASSIGNED_SECRET_PLACEHOLDER,
  getUnsupportedSecretMessage,
  MCP_POLICY_NAME,
} from '../../Constants';
import { formatName } from '../../formatName';
import { useCatalogOperations } from '../../queries/useCatalog';
import { useConfig } from '../../queries/useConfig';
import useDDInfo from '../../queries/useDDInfo';
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

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const theme = useTheme();

  const { isLoading: secretsLoading, mutate: mutateSecret } =
    useSecrets(client);
  const { registerCatalogItem, unregisterCatalogItem } =
    useCatalogOperations(client);
  const { configLoading } = useConfig(client);

  const { ddInfo, ddInfoLoading } = useDDInfo(client);

  useEffect(() => {
    setLocalSecrets(
      catalogItem.secrets.reduce((acc, secret) => {
        acc[secret.name] = secret.assigned ? ASSIGNED_SECRET_PLACEHOLDER : '';
        return acc;
      }, {} as { [key: string]: string | undefined })
    );
  }, [catalogItem.secrets]);

  useEffect(() => {
    if (!catalogItem.canRegister) {
      setTabValue(1);
    }
  }, [catalogItem.canRegister]);

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
    borderRadius: 1,
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
              width: 40,
              height: 40,
              borderRadius: 1,
            }}
          />
          {formatName(catalogItem.name)}
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
          {catalogItem.missingSecrets && (
            <Chip label="Requires secrets" color="warning" />
          )}
          {catalogItem.missingConfig && (
            <Chip label="Requires configuration" color="warning" />
          )}
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
        {catalogItem.readme !== undefined && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            <Link
              onClick={() => client.host.openExternal(catalogItem.readme || '')}
              href={catalogItem.readme || ''}
              target="_blank"
            >
              {catalogItem.readme || ''}
              <Launch />
            </Link>
          </Typography>
        )}

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
                        Configuration
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
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(catalogItem.tools || []).map((tool) => (
                      <TableRow>
                        <TableCell>
                          <Typography
                            key={tool.name}
                            variant="body2"
                            sx={toolChipStyle}
                          >
                            {tool.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Link
                            onClick={() =>
                              client.host.openExternal(
                                `${
                                  catalogItem.readme
                                }#tool-${tool.name.replaceAll(' ', '-')}` || ''
                              )
                            }
                            href="#"
                            target="_blank"
                          >
                            Documentation
                            <Launch />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Stack
                spacing={1}
                sx={{
                  padding: 1,
                  overflow: 'auto',
                  height: 'calc(80vh - 200px)',
                  minHeight: '180px',
                }}
              >
                <Stack direction="column" spacing={2}>
                  <ConfigEditor catalogItem={catalogItem} client={client} />
                  <Stack>
                    <Typography variant="subtitle2">Secrets</Typography>
                    {!ddInfo && !ddInfoLoading && (
                      <Alert severity="error">
                        Failed to get Docker Desktop version
                      </Alert>
                    )}
                    {ddInfo && !ddInfo?.hasSecretSupport && (
                      <Alert severity="error">
                        {getUnsupportedSecretMessage(ddInfo?.parsedVersion)}
                      </Alert>
                    )}
                    {ddInfo?.hasSecretSupport &&
                    catalogItem.secrets &&
                    catalogItem.secrets?.length > 0 ? (
                      catalogItem.secrets.map((secret, index) => {
                        const secretEdited =
                          (secret.assigned &&
                            localSecrets[secret.name] !==
                              ASSIGNED_SECRET_PLACEHOLDER) ||
                          (!secret.assigned &&
                            localSecrets[secret.name] !== '');
                        return (
                          <Stack
                            key={secret.name}
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <TextField
                              size="small"
                              inputRef={(element) =>
                                (inputRefs.current[index] = element)
                              }
                              disabled={secret.assigned}
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
                                onClick={() => {
                                  setLocalSecrets({
                                    ...localSecrets,
                                    [secret.name]: '',
                                  });
                                  // We need to enable the input to be able to focus on it
                                  inputRefs.current[index].disabled = false;
                                  inputRefs.current[index].focus();
                                  mutateSecret.mutateAsync({
                                    name: secret.name,
                                    value: undefined,
                                    policies: [MCP_POLICY_NAME],
                                  });
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            )}
                            {secretEdited && (
                              <ButtonGroup>
                                <IconButton
                                  size="small"
                                  onClick={async () => {
                                    await mutateSecret.mutateAsync({
                                      name: secret.name,
                                      value: localSecrets[secret.name]!,
                                      policies: [MCP_POLICY_NAME],
                                    });
                                  }}
                                >
                                  <CheckOutlined
                                    fontSize="small"
                                    sx={{ color: 'success.main' }}
                                  />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={async () => {
                                    setLocalSecrets({
                                      ...localSecrets,
                                      [secret.name]: secret.assigned
                                        ? ASSIGNED_SECRET_PLACEHOLDER
                                        : '',
                                    });
                                  }}
                                >
                                  <CloseOutlined
                                    fontSize="small"
                                    sx={{ color: 'error.main' }}
                                  />
                                </IconButton>
                              </ButtonGroup>
                            )}
                          </Stack>
                        );
                      })
                    ) : (
                      <Typography>No secrets available.</Typography>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </TabPanel>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;
