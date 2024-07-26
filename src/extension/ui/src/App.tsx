import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Divider, FormControlLabel, FormGroup, Link, List, ListItem, Modal, Paper, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { title } from 'process';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [response, setResponse] = React.useState<{ message: string; status: 'error' | 'loading' | 'success' }>();
  const [runbooks, setRunbooks] = React.useState<boolean>(true);
  const [dockerVscode, setDockerVscode] = React.useState<boolean>(true);
  const [checkCodeResp, setCheckCodeResp] = React.useState<{ ready: boolean; message: string }>({ ready: false, message: "..." });
  const ddClient = useDockerDesktopClient();

  let binary = "install";

  if (ddClient.host.platform === 'win32') {
    binary = "install.exe";
  }

  useEffect(() => {
    const checkCode = async () => {
      const result = await ddClient.extension.host?.cli.exec(binary, ["check-code"]);
      if (result?.stderr) {
        setCheckCodeResp({ ready: false, message: result?.stderr || "An error occurred while checking the code." });
        return;
      }
      setCheckCodeResp({ ready: true, message: result?.stdout || "Good" });
    };
    checkCode();
  }, []);

  const installAndDisplayResponse = async () => {
    setResponse({ message: "Installing...", status: "loading" })

    const args = ["install", "docker-vscode"];

    if (runbooks) {
      args.push("labs-make-runbook");
    }

    try {
      const result = await ddClient.extension.host?.cli.exec(binary, args);
      setResponse({ message: result?.stdout || "Success", status: "success" });
    }
    catch (e: any) {
      setResponse({ message: JSON.stringify(e, null, 2), status: "error" });
      return;
    }
  };

  const resetAndDisplayResponse = async () => {
    setResponse({ message: "Uninstalling...", status: "loading" })

    const args = ["uninstall"];

    if (runbooks) {
      args.push("docker.make-runbook");
    }

    args.push("ms-azuretools.vscode-docker");

    try {
      const result = await ddClient.extension.host?.cli.exec(binary, args);
      setResponse({ message: result?.stdout || "Success", status: "success" });
    }
    catch (e: any) {
      setResponse({ message: JSON.stringify(e, null, 2), status: "error" });
      return;
    }
  };

  const readyToInstall = checkCodeResp?.ready && dockerVscode;
  const readyToUninstall = checkCodeResp?.ready && runbooks;

  return (
    <>
      <Modal open={true}>
        <div>
          <h1>Modal</h1>
        </div>
      </Modal>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h1">Docker Labs Experiments</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Install and reset Docker Labs VSCode extensions.
        </Typography>
        <Typography variant="subtitle1" sx={(theme) => ({ color: theme.palette.docker.amber[500], mt: 2 })}>
          <strong>
            Disclaimer: Our VSCode extensions are ready for evaluation, but are not ready to enter the public marketplace.
          </strong>
        </Typography>
        <pre>
          {checkCodeResp?.message}
        </pre>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The following tools are currently available to evaluate:
          <List>
            <ListItem><strong>LSP Extension:</strong>&nbsp;<Link href="https://github.com/docker/docker-vscode">Docker-VSCode</Link></ListItem>
            <ListItem><strong>Runbook Extension:</strong>&nbsp;<Link href="https://github.com/docker/labs-make-runbook">labs-make-runbooks</Link></ListItem>
            <ListItem>Automatic Githooks:&nbsp;<Link href="https://github.com/docker/labs-githooks">labs-githooks</Link></ListItem>
            {/* <ListItem>Dockerized NPM:&nbsp;<Link href="https://github.com/docker/labs-npdx">NPDX</Link></ListItem> */}
          </List>
        </Typography>
        <Divider sx={{ maxWidth: '40%' }} />
        <Stack direction="column" alignItems="start" spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Select the VSCode features you would like to install:
          </Typography>
          <FormGroup>
            <FormControlLabel control={<Switch defaultChecked />} checked={dockerVscode} onChange={e => setDockerVscode((e.target as any).checked)} label="Language Services" />
            <FormControlLabel control={<Switch defaultChecked />} checked={runbooks} onChange={e => setRunbooks((e.target as any).checked)} label="Runbook features" />
          </FormGroup>
          <Stack direction="row" spacing={2}>
            <Tooltip title={readyToInstall ? 'Install extensions' : 'Installation of runbooks depends on language services.'}>
              <span>
                <Button variant="contained" onClick={installAndDisplayResponse} disabled={!readyToInstall}>
                  Install Docker extensions
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={readyToUninstall ? 'Uninstall extensions' : 'Uninstallation of language services must also uninstall runbooks.'}>
              <span>
                <Button variant="outlined" onClick={resetAndDisplayResponse} disabled={!readyToUninstall}>
                  Uninstall Docker extensions
                </Button>
              </span>
            </Tooltip>
          </Stack>
          <Typography variant="body1" sx={{ my: 1 }}>
            Status: {response?.status}
          </Typography>
          <TextField
            label="Response"
            error={response?.status === 'error'}
            sx={{ width: "100%" }}
            disabled
            multiline
            variant="outlined"
            minRows={5}
            value={response?.message ?? ''}
          />
          <Button onClick={async () => {
            const result = await ddClient.desktopUI.dialog.showOpenDialog({
              title: "Select a file",

            })

          }}>
            TEST BUTTON
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
