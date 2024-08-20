import React, { useEffect } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Paper, Stack, Typography, Button } from '@mui/material';
import { getRunArgs } from './args';
import OpenAIKey from './components/OpenAIKey';
import Projects from './components/Projects';
import Prompts from './components/Prompts';
import RunOutput from './components/RunOutput';
import Runner from './components/Runner'; // Added this import

const client = createDockerDesktopClient();

const track = (event: string) =>
  client.extension.vm?.service?.post('/analytics/track', { event });

class OutputParser {
  output: any[] = [];
  callback: (output: any[]) => void;
  constructor(callback: (output: any[]) => void) {
    this.output = [];
    this.callback = callback;
  }
  updateOutput = (line: any) => {
    let output = [...this.output];
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
    this.callback(output);
  }
}

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

  const [runOut, setRunOut] = React.useState<any[]>([]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [showDebug, setShowDebug] = React.useState(false);

  useEffect(() => {
    const runOutput = new OutputParser(setRunOut);
    try {
      client.docker.cli.exec("pull", ["vonwig/function_write_files"]).then(() => {
        client.docker.cli.exec("run", [
          "-v",
          "openai_key:/root",
          "--workdir", "/root",
          "vonwig/function_write_files",
          `'` + JSON.stringify({ files: [{ path: ".openai-api-key", content: openAIKey, executable: false }] }) + `'`
        ]);
      });
      client.docker.cli.exec("pull", ["vonwig/prompts"], {
        stream: {
          onOutput: ({ stdout, stderr }) => {
            if (stdout) {
              runOutput.updateOutput({ method: 'message', params: { debug: stdout } });
            }
            if (stderr) {
              runOutput.updateOutput({ method: 'error', params: { content: stderr } });
            }
          },
          onError: (err) => {
            runOutput.updateOutput({ method: 'error', params: { content: err } });
          },
        },
      });
    }
    catch (e) {
      runOutput.updateOutput({ method: 'message', params: { debug: JSON.stringify(e) } });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
    if (selectedProject && projects.length === 0) {
      setSelectedPrompt(null);
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
    if (!selectedPrompt && prompts.length > 0) {
      setSelectedPrompt(prompts[0]);
    }
    if (selectedProject && prompts.length === 0) {
      setSelectedPrompt(null);
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
    if (promptInput?.startsWith('http')) {
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

  const startPrompt = async () => {
    track('start-prompt');

    const runOutput = new OutputParser(setRunOut);
    runOutput.updateOutput({ method: 'message', params: { debug: 'Pulling images' } })

    runOutput.updateOutput({ method: 'message', params: { debug: 'Running prompts...' } })
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
            runOutput.updateOutput(json)
          }
          if (stderr) {
            runOutput.updateOutput({ method: 'message', params: { debug: stderr } });
          }
        },
        onError: (err) => {
          console.error(err);
          runOutput.updateOutput({ method: 'message', params: { debug: err } });
        },
      }
    });
    track('end-prompt');
  }

  const renderPrompt = async () => {
    await client.docker.cli.exec("pull", ["vonwig/prompts"]);
    const args = getRunArgs(selectedPrompt!, selectedProject!, "", client.host.platform, true)
    const render = await client.docker.cli.exec("run", args);
    console.log(render);
  }

  return (
    <div style={{ overflow: 'auto', maxHeight: '100vh' }} ref={scrollRef}>
      <Stack direction="column" spacing={1}>
        <OpenAIKey openAIKey={openAIKey || ''} setOpenAIKey={setOpenAIKey} />
        <Projects projects={projects} selectedProject={selectedProject} setProjects={setProjects} setSelectedProject={setSelectedProject} />
        <Prompts prompts={prompts} selectedPrompt={selectedPrompt} promptInput={promptInput} setPrompts={setPrompts} setSelectedPrompt={setSelectedPrompt} setPromptInput={setPromptInput} track={track} />
        <Runner selectedProject={selectedProject} selectedPrompt={selectedPrompt} openAIKey={openAIKey} startPrompt={startPrompt} renderPrompt={renderPrompt} />
        <RunOutput runOut={runOut} showDebug={showDebug} setShowDebug={setShowDebug} />
      </Stack>
    </div>
  )
}