import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import DelIcon from '@mui/icons-material/Delete';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { IconButton, Link, List, ListItem, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material';
import { getRunArgs } from './args';
import Convert from 'ansi-to-html';

const convert = new Convert({ newline: true });

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

  const [runOut, setRunOut] = React.useState<string>('');

  const scrollRef = React.useRef<HTMLDivElement>(null);


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
    let output = ""
    const updateOutput = (data: string) => {
      output += data;
      setRunOut(output);
    }
    updateOutput("Pulling images\n")
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
      updateOutput(JSON.stringify({ pullWriteFiles, pullPrompts, writeKey }));
    }
    catch (e) {
      updateOutput(JSON.stringify(e));
    }
    updateOutput("Running prompts\n")
    const args = getRunArgs(selectedPrompt!, selectedProject!, "", client.host.platform)

    client.docker.cli.exec("run", args, {
      stream: {
        splitOutputLines: true,
        onOutput: ({ stdout, stderr }) => {
          if (stdout && stdout.startsWith('{')) {
            let rpcMessage = stdout.split('}Content-Length:')[0]
            if (!rpcMessage.endsWith('}')) {
              rpcMessage += '}'
            }
            const json = JSON.parse(rpcMessage)
            if (json.params.content) {
              output += json.params.content
            }
          }
          if (stderr) {
            output += stderr
          }
          setRunOut(output);
        },
        onError: (err) => {
          console.error(err);
          output += err;
          setRunOut(output);
        }
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
          <TextField
            sx={{ width: '100%', mt: 1 }}
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
                }}>
                  <ListItemText primary={prompt.split(delim).pop()} secondary={prompt} />
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
          runOut && (
            <Paper sx={{ p: 1 }}>
              <Typography variant='h3'>Run output</Typography>
              <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: convert.toHtml(runOut) }} />
            </Paper>
          )
        }
      </Stack>
    </div>
  )
}
