import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import DelIcon from '@mui/icons-material/Delete';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Chip, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material';
import { getRunArgs } from './args';
import Convert from 'ansi-to-html';

const convert = new Convert({ newline: true });

type RPCMessage = {
  jsonrpc?: string;
  method: string;
  params: any;
}

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
  const [selectedProject, setSelectedProject] = React.useState<string | null>(localStorage.getItem('selectedProject') || null);

  const [prompts, setPrompts] = React.useState<string[]>(localStorage.getItem('prompts') ? JSON.parse(localStorage.getItem('prompts')!) : []);
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | null>(localStorage.getItem('selectedPrompt') || null);

  const [openAIKey, setOpenAIKey] = React.useState<string | null>(localStorage.getItem('openAIKey') || '');

  const [promptInput, setPromptInput] = React.useState<string>('');

  const [runOut, setRunOut] = React.useState<RPCMessage[]>([]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [showDebug, setShowDebug] = React.useState(false);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
    if (!selectedPrompt && prompts.length > 0) {
      setSelectedPrompt(prompts[0]);
    }
  }, [prompts]);

  useEffect(() => {
    debouncedToastSuccess('OpenAI key saved');
    localStorage.setItem('openAIKey', openAIKey || '');
  }, [openAIKey]);

  useEffect(() => {
    localStorage.setItem('selectedProject', selectedProject || '');
  }, [selectedProject]);

  useEffect(() => {
    localStorage.setItem('selectedPrompt', selectedPrompt || '');
  }, [selectedPrompt]);

  useEffect(() => {
    // URL format: https://github.com/<owner>/<repo>/tree/<branch>/<path>
    // REF format: github.com:<owner>/<repo>?ref=<branch>&path=<path>
    if (promptInput?.startsWith('http')) {
      // Convert URL to REF
      const url = new URL(promptInput);
      const registry = url.hostname.split('.').reverse().slice(1).reverse().join('.');
      const owner = url.pathname.split('/')[1];
      const repo = url.pathname.split('/')[2];
      const branch = url.pathname.split('/')[4];
      const path = url.pathname.split('/').slice(5).join('/');
      const ref = `${registry}:${owner}/${repo}?ref=${branch}&path=${path}`;
      setPromptInput(ref);
    }
  }, [promptInput]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [runOut]);

  const delim = client.host.platform === 'win32' ? '\\' : '/';

  const startPrompt = async () => {
    let output: RPCMessage[] = []
    const updateOutput = (line: RPCMessage) => {
      if (line.method === 'functions') {
        const functions = line.params;
        for (const func of functions) {
          const functionId = func.id;
          const existingFunction = output.find(o =>
            o.method === 'functions'
            &&
            o.params.find((p: { id: string }) => p.id === functionId)
          );
          if (existingFunction) {
            const existingFunctionParamsIndex = existingFunction.params.findIndex((p: { id: string }) => p.id === functionId);
            existingFunction.params[existingFunctionParamsIndex] = { ...existingFunction.params[existingFunctionParamsIndex], ...func };
            output = output.map(
              o => o.method === 'functions'
                ?
                { ...o, params: o.params.map((p: { id: string }) => p.id === functionId ? { ...p, ...func } : p) }
                :
                o
            );
          } else {
            output = [...output, line];
          }
        }
      }
      else {
        output = [...output, line];
      }
      setRunOut(output);
    }
    updateOutput({ method: 'message', params: { debug: 'Pulling images' } })
    try {
      const pullWriteFiles = await client.docker.cli.exec("pull", ["vonwig/function_write_files"]);
      const pullPrompts = await client.docker.cli.exec("pull", ["vonwig/prompts"]);
      const writeKey = await client.docker.cli.exec("run", [
        "-v",
        "openai_key:/root",
        "--workdir", "/root",
        "vonwig/function_write_files",
        `'` + JSON.stringify({ files: [{ path: ".openai-api-key", content: openAIKey, executable: false }] }) + `'`
      ]);
      updateOutput({ method: 'message', params: { debug: JSON.stringify({ pullWriteFiles, pullPrompts, writeKey }) } });
    }
    catch (e) {
      updateOutput({ method: 'message', params: { debug: JSON.stringify(e) } });
    }
    updateOutput({ method: 'message', params: { debug: 'Running prompts...' } })
    const args = getRunArgs(selectedPrompt!, selectedProject!, "", client.host.platform)

    client.docker.cli.exec("run", args, {
      stream: {
        splitOutputLines: true,
        onOutput: ({ stdout, stderr }) => {
          if (stdout && stdout.startsWith('{')) {
            let rpcMessage = stdout.split('}Content-Length:')[0]
            if (!rpcMessage.endsWith('}}')) {
              rpcMessage += '}'
            }
            const json = JSON.parse(rpcMessage)
            updateOutput(json)
            //   {
            //     "jsonrpc": "2.0",
            //     "method": "functions",
            //     "params": [
            //         {
            //             "function": {
            //                 "name": "run-eslint",
            //                 "arguments": "{\n  \""
            //             },
            //             "id": "call_53E2o4fq1QEmIHixWcKZmOqo"
            //         }
            //     ]
            // }
          }
          if (stderr) {
            updateOutput({ method: 'message', params: { debug: stderr } });
          }
        },
        onError: (err) => {
          console.error(err);
          updateOutput({ method: 'message', params: { debug: err } });
        },
      }
    });
  }

  return (
    <div style={{ overflow: 'auto', maxHeight: '100vh' }} ref={scrollRef}>
      <Stack direction="column" spacing={1}>
        <Paper sx={{ padding: 1 }}>
          <Typography variant='h3'>OpenAI Key</Typography>
          <TextField sx={{ mt: 1, width: '100%' }} onChange={e => setOpenAIKey(e.target.value)} value={openAIKey || ''} placeholder='Enter OpenAI API key' type='password' />
        </Paper>
        {/* Projects column */}
        <Paper sx={{ padding: 1 }}>
          <Typography variant='h3'>Projects</Typography>
          <Stack direction='row' spacing={1} sx={{ mt: 1 }} alignItems={'center'} justifyContent={'space-between'}>
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
                key={project}
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
        {/* Prompts column */}
        <Paper sx={{ padding: 1 }}>
          <Typography variant="h3">Prompts</Typography>
          <Stack direction='row' spacing={1} alignItems={'center'} justifyContent={'space-between'}>
            <TextField
              fullWidth
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
            <Button onClick={() => {
              client.desktopUI.dialog.showOpenDialog({
                properties: ['openDirectory', 'multiSelections']
              }).then((result) => {
                if (result.canceled) {
                  return;
                }
                setPrompts([...prompts, ...result.filePaths.map(p => `local://${p}`)]);
              });
            }}>Add local prompt</Button>
          </Stack>

          <List>
            {prompts.map((prompt) => (
              <ListItem
                key={prompt}
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
                }}>{
                    prompt.startsWith('local://') ?
                      <><ListItemText primary={<>{prompt.split(delim).pop()}<Chip sx={{ ml: 1 }} label='local' /></>} secondary={prompt.replace('local://', '')} /></>
                      :
                      <ListItemText primary={prompt.split('/').pop()} secondary={prompt} />
                  }
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
        {/* Show row at bottom if selectProject AND selectedPrompt */}
        {selectedProject && selectedPrompt && openAIKey ? (
          <Paper sx={{ padding: 1 }}>
            <Typography variant="h3">Ready</Typography>
            <pre>PROJECT={selectedProject}</pre>
            <pre>PROMPT={selectedPrompt}</pre>
            <Button sx={{ mt: 1, }} color='success' onClick={startPrompt}>
              Run
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ padding: 1 }}>
            <Typography variant='h3'>Missing:</Typography>
            {selectedProject?.length ? null : <Typography variant='body1'> - Project</Typography>}
            {selectedPrompt?.length ? null : <Typography variant='body1'> - Prompt</Typography>}
            {openAIKey?.length ? null : <Typography variant='body1'> - OpenAI Key</Typography>}
          </Paper>
        )}
        {/* Show run output */}
        {
          runOut.length > 0 && (
            <Paper sx={{ p: 1 }}>
              <Stack direction='row' spacing={1} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant='h3'>Run output</Typography>
                <Button onClick={() => setShowDebug(!showDebug)}>{showDebug ? 'Hide' : 'Show'} debug</Button>
              </Stack>

              <div style={{ overflow: 'auto', maxHeight: '100vh' }}>
                {runOut.map((line, i) => {
                  if (line.method === 'message') {
                    if (line.params.debug) {
                      return showDebug ? <Typography key={i} variant='body1' sx={theme => ({ color: theme.palette.docker.grey[400] })}>{line.params.debug}</Typography> : null;
                    }
                    return <pre key={i} style={{ whiteSpace: 'pre-wrap', display: 'inline' }} dangerouslySetInnerHTML={{ __html: convert.toHtml(line.params.content) }} />
                  }
                  if (line.method === 'functions') {
                    return <Typography key={i} variant='body1' sx={theme => ({ whiteSpace: 'pre-wrap', backgroundColor: theme.palette.docker.grey[300], p: 1 })}>{JSON.stringify(line.params, null, 2)}</Typography>
                  }
                  if (line.method === 'functions-done') {
                    return showDebug ? <Typography key={i} variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(line.params, null, 2)}</Typography> : null;
                  }
                  return <Typography key={i} variant='body1'>{JSON.stringify(line)}</Typography>
                })}
              </div>
            </Paper>
          )
        }
      </Stack>
    </div>
  )
}
