import { createDockerDesktopClient } from '@docker/extension-api-client';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import ChatGPTIcon from '../../assets/chatgpt.svg';
import ClaudeIcon from '../../assets/claude-ai-icon.svg';
import CursorIcon from '../../assets/cursor.svg';
import GordonIcon from '../../assets/gordon-icon.png';
import WindsurfIcon from '../../assets/windsurf.svg';
import ContinueIcon from '../../assets/continue.svg';
import { CATALOG_LAYOUT_SX, DOCKER_MCP_COMMAND } from '../../Constants';

// Initialize the Docker Desktop client
const client = createDockerDesktopClient();

type MCPClientSettingsProps = {
  appProps: any; // Pass the app props from the parent
};

const iconMap = {
  'Claude Desktop': ClaudeIcon,
  Gordon: GordonIcon,
  Cursor: CursorIcon,
  Windsurf: WindsurfIcon,
  'Continue.dev': ContinueIcon,
};

const MCPClientSettings = ({ appProps }: MCPClientSettingsProps) => {
  // Extract all the values we need from appProps
  const { mcpClientStates } = appProps;

  if (!mcpClientStates) {
    return (
      <>
        <CircularProgress />
        <Typography>Loading MCP clients...</Typography>
      </>
    );
  }

  const [copyButtonText, setCopyButtonText] = useState('Copy');

  return (
    <Stack sx={CATALOG_LAYOUT_SX} spacing={2}>
      <Stack direction="column" spacing={1}>
        {Object.entries(mcpClientStates).map(
          ([name, mcpClientState]: [string, any]) => {
            return (
              <ClientSetting
                key={name}
                name={name}
                mcpClientState={mcpClientState}
                appProps={appProps}
              />
            );
          }
        )}

        <Card>
          <CardHeader
            avatar={
              <Avatar
                variant="square"
                src={ChatGPTIcon}
                alt="ChatGPT Desktop"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                }}
              />
            }
            title={
              <Typography variant="subtitle2">
                {'ChatGPT'}{' '}
                <Chip label="Coming soon" color="primary" size="small" />
              </Typography>
            }
          />
        </Card>
      </Stack>

      <Divider>Or</Divider>
      <Stack direction="column" alignItems="center" spacing={1}>
        Connect other MCP clients to the same server by specifying the following
        command:
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
          spacing={1}
        >
          <Typography
            variant="caption"
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.background.default
                  : theme.palette.grey[200],
              padding: 1,
              borderRadius: 1,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              overflow: 'auto',
              color: 'text.primary',
            })}
          >
            {DOCKER_MCP_COMMAND}
            <Button
              color={copyButtonText === 'Copied!' ? 'success' : 'primary'}
              sx={{ py: '2px', px: '12px', fontSize: '1em', ml: 1 }}
              onClick={() => {
                navigator.clipboard.writeText(DOCKER_MCP_COMMAND);
                setCopyButtonText('Copied!');
                setTimeout(() => setCopyButtonText('Copy'), 2000);
              }}
            >
              {copyButtonText}
            </Button>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

function ClientSetting({
  name,
  mcpClientState,
  appProps,
}: {
  name: string;
  mcpClientState: any;
  appProps: any;
}) {
  const [expanded, setExpanded] = useState(false);

  // Extract all the values we need from appProps
  const { buttonsLoading, setButtonsLoading, disconnectClient, connectClient } =
    appProps;

  return (
    <Card>
      <CardHeader
        avatar={
          iconMap[name as keyof typeof iconMap] && (
            <Avatar
              variant="square"
              src={iconMap[name as keyof typeof iconMap]}
              alt={name}
              sx={{
                width: 40,
                height: 40,
              }}
            />
          )
        }
        title={<Typography variant="subtitle2">{name}</Typography>}
        subheader={
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              alignItems: 'center',
              display: 'flex',
              cursor: 'pointer',
            }}
            onClick={() => setExpanded(!expanded)}
          >
            Manual configuration
            {expanded ? (
              <KeyboardArrowDownIcon fontSize="small" />
            ) : (
              <KeyboardArrowRightIcon fontSize="small" />
            )}
          </Typography>
        }
        action={
          <Stack direction="row" spacing={1}>
            {mcpClientState.exists && mcpClientState.configured && (
              <Button
                onClick={async () => {
                  setButtonsLoading({
                    ...buttonsLoading,
                    [name]: true,
                  });
                  try {
                    await disconnectClient(name);
                  } finally {
                    setButtonsLoading({
                      ...buttonsLoading,
                      [name]: false,
                    });
                  }
                }}
                disabled={
                  buttonsLoading[name] ||
                  Boolean(mcpClientState.preventAutoConnectMessage)
                }
                color="warning"
                size="small"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {(buttonsLoading[name] && (
                    <>
                      <Typography sx={{ fontSize: 12, width: 70 }}>
                        Connect
                      </Typography>
                      <CircularProgress size={12} />
                    </>
                  )) || (
                    <Typography sx={{ fontSize: 12, width: 90 }}>
                      Disconnect
                    </Typography>
                  )}
                </Stack>
              </Button>
            )}
            {mcpClientState.exists && !mcpClientState.configured && (
              <Button
                sx={{ fontSize: 12 }}
                onClick={async () => {
                  setButtonsLoading({
                    ...buttonsLoading,
                    [name]: true,
                  });
                  try {
                    await connectClient(name);
                  } finally {
                    setButtonsLoading({
                      ...buttonsLoading,
                      [name]: false,
                    });
                  }
                }}
                disabled={
                  buttonsLoading[name] ||
                  Boolean(mcpClientState.preventAutoConnectMessage)
                }
                color="primary"
                size="small"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {(buttonsLoading[name] && (
                    <>
                      <Typography sx={{ fontSize: 12, width: 70 }}>
                        Disconnect
                      </Typography>
                      <CircularProgress size={12} />
                    </>
                  )) || (
                    <Typography sx={{ fontSize: 12, width: 90 }}>
                      Connect
                    </Typography>
                  )}
                </Stack>
              </Button>
            )}
            {!mcpClientState.exists && (
              <Button
                sx={{ fontSize: 12 }}
                size="small"
                onClick={async () => {
                  setButtonsLoading({
                    ...buttonsLoading,
                    [name]: true,
                  });
                  try {
                    await connectClient(name);
                  } finally {
                    setButtonsLoading({
                      ...buttonsLoading,
                      [name]: false,
                    });
                  }
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {(buttonsLoading[name] && (
                    <>
                      <Typography sx={{ fontSize: 12, width: 70 }}>
                        Disconnect
                      </Typography>
                      <CircularProgress size={12} />
                    </>
                  )) || (
                    <Typography sx={{ fontSize: 12, width: 90 }}>
                      Connect
                    </Typography>
                  )}
                </Stack>
              </Button>
            )}
          </Stack>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Stack direction="column" justifyContent="center" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Link
                href={mcpClientState.client.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  client.host.openExternal(mcpClientState.client.url)
                }
              >
                {mcpClientState.client.url}
              </Link>
            </Stack>
            <Typography sx={{ fontWeight: 'bold' }}>
              Expected Config Path
            </Typography>
            <Typography
              component="pre"
              sx={{
                color: 'text.primary',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                overflow: 'auto',
                backgroundColor: 'background.default',
                padding: 1,
                borderRadius: 1,
                fontSize: '12px',
              }}
            >
              {mcpClientState.client.expectedConfigPath?.[
                client.host.platform as 'win32' | 'darwin' | 'linux'
              ] || 'N/A'}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              Manual configuration
            </Typography>
          </Stack>
          <List sx={{ listStyleType: 'decimal', p: 0, pl: 2, mt: 1 }}>
            {mcpClientState.client.manualConfigSteps.map(
              (step: string, index: number) => (
                <ListItem sx={{ display: 'list-item', p: 0 }} key={index}>
                  <ListItemText
                    primary={<div dangerouslySetInnerHTML={{ __html: step }} />}
                  />
                </ListItem>
              )
            )}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default MCPClientSettings;
