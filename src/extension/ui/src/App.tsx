import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import DelIcon from '@mui/icons-material/Delete';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Divider, FormControlLabel, FormGroup, Grid, Icon, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Paper, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { getRunArgs } from './args';
import { on } from 'events';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

const debounce = (fn: Function, ms: number) => {
  let timeout: NodeJS.Timeout;
  return function (...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

const debouncedToastSuccess = debounce(client.desktopUI.toast.success, 1000)

export function App() {
  const [projects, setProjects] = React.useState<string[]>(localStorage.getItem('projects') ? JSON.parse(localStorage.getItem('projects')!) : []);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  const [prompts, setPrompts] = React.useState<string[]>(localStorage.getItem('prompts') ? JSON.parse(localStorage.getItem('prompts')!) : []);
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | null>(null);

  const [openAIKey, setOpenAIKey] = React.useState<string | null>(null);

  const [promptInput, setPromptInput] = React.useState<string>('');

  const [runOut, setRunOut] = React.useState<string>('');

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    debouncedToastSuccess('OpenAI key saved');
    localStorage.setItem('openAIKey', openAIKey || '');
  }, [openAIKey]);


  useEffect(() => {
    // URL format: https://github.com/<owner>/<repo>/tree/<branch>/<path>
    // REF format: github.com:<owner>/<repo>?ref=<branch>&path=<path>
    if (promptInput?.startsWith('http')) {
      // Convert URL to REF
      const url = new URL(promptInput);
      const registry = url.hostname
      const owner = url.pathname.split('/')[1];
      const repo = url.pathname.split('/')[2];
      const branch = url.pathname.split('/')[4];
      const path = url.pathname.split('/').slice(5).join('/');
      const ref = `${registry}:${owner}/${repo}?ref=${branch}&path=${path}`;
      setPromptInput(ref);
    }
  }, [promptInput]);

  const delim = client.host.platform === 'win32' ? '\\' : '/';

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: 1, pl: 2 }}>
            <Stack direction='row' spacing={2} alignItems={'center'} justifyContent={'space-between'}>
              <Typography sx={{ flex: '1 1 30%' }} variant='h4'>OpenAI Key</Typography>
              <TextField sx={{ flex: '1 1 70%' }} onChange={e => setOpenAIKey(e.target.value)} value={openAIKey} placeholder='Enter OpenAI API key' type='password' />
            </Stack>
          </Paper>
        </Grid>
        {/* Projects column */}
        <Grid item xs={6}>
          <Paper sx={{ padding: 2 }}>
            <Stack direction='row' spacing={2} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant='h2' sx={{ m: 2, display: 'inline' }}>Projects</Typography>
              <Button sx={{ padding: 1 }} onClick={() => {
                client.desktopUI.dialog.showOpenDialog({
                  properties: ['openDirectory', 'multiSelections']
                }).then((result) => {
                  if (result.canceled) {
                    return;
                  }
                  const newProjects = result.filePaths
                  setProjects([...projects, ...newProjects]);
                });
              }}>
                Add project
              </Button>
            </Stack>
            <List>
              {projects.map((project) => (
                <ListItem
                  sx={theme => ({ borderLeft: 'solid black 3px', borderColor: selectedProject === project ? theme.palette.success.main : 'none', my: 0.5, padding: 0 })}
                  secondaryAction={
                    <IconButton color='error' onClick={() => {
                      // Confirm
                      const confirm = window.confirm(`Are you sure you want to remove ${project}?`);
                      if (!confirm) {
                        return;
                      }
                      setProjects(projects.filter((p) => p !== project));
                    }}>
                      <DelIcon />
                    </IconButton>
                  }>
                  <ListItemButton sx={{ padding: 0, pl: 1.5 }} onClick={() => {
                    setSelectedProject(project);
                  }}>
                    <ListItemText primary={project.split(delim).pop()} secondary={project} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        {/* Prompts column */}
        <Grid item xs={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h2" component="h2">Prompts</Typography>
            <TextField
              sx={{ width: '100%' }}
              placeholder='Enter GitHub ref or URL'
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
            />
            {promptInput.length > 0 && (
              <Button onClick={() => {
                setPrompts([...prompts, promptInput]);
                setPromptInput('');
              }}>Add prompt</Button>
            )}
            <List>
              {prompts.map((prompt) => (
                <ListItem
                  sx={theme => ({
                    borderLeft: 'solid black 3px',
                    borderColor: selectedPrompt === prompt ? theme.palette.success.main : 'none',
                    my: 0.5,
                    padding: 0
                  })}
                  secondaryAction={
                    <IconButton color='error' onClick={() => {
                      // Confirm
                      const confirm = window.confirm(`Are you sure you want to remove ${prompt}?`);
                      if (!confirm) {
                        return;
                      }
                      setPrompts(prompts.filter((p) => p !== prompt));
                    }}>
                      <DelIcon />
                    </IconButton>
                  }>
                  <ListItemButton sx={{ padding: 0, pl: 1.5 }} onClick={() => {
                    setSelectedPrompt(prompt);
                  }}>
                    <ListItemText primary={prompt.split(delim).pop()} secondary={prompt} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        {/* Show row at bottom if selectProject AND selectedPrompt */}
        {selectedProject && selectedPrompt ? (
          <Grid item xs={12}>
            <Paper sx={{ padding: 1 }}>
              <Typography variant="h3" component="h2">Ready</Typography>
              <Typography><pre>PROJECT={selectedProject}</pre></Typography>
              <Typography><pre>PROMPT={selectedPrompt}</pre></Typography>
              <Button sx={{ mt: 1, }} color='success' onClick={async () => {
                // Write openai key to $HOME/.openai-api-key
                setRunOut('Writing OpenAI key...');
                await client.extension.vm?.cli.exec('/bin/sh', ['-c', `echo ${openAIKey} > $HOME/.openai-api-key`]);
                setRunOut('Running...');
                client.docker.cli.exec('run', getRunArgs(selectedPrompt, selectedProject, client.host.hostname, client.host.platform), {
                  stream: {
                    onError: (err) => {
                      setRunOut(runOut + '\n' + err.message);
                    },
                    onOutput: ({ stdout, stderr }) => {
                      setRunOut(runOut + '\n' + (stdout || stderr));
                    }
                  }
                })
              }}>
                <Typography variant='h3'>Run</Typography>
              </Button>
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Paper>
              You must select a project and a prompt to run.
            </Paper>
          </Grid>
        )}
        {/* Show run output */}
        {runOut && (
          <Grid item xs={12}>
            <Paper>
              <Typography variant='h3'>Run output</Typography>
              <pre>{runOut}</pre>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
}
