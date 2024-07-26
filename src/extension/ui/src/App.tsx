import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Divider, FormControlLabel, FormGroup, Grid, Link, List, ListItem, Modal, Paper, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material';
import { title } from 'process';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

export function App() {
  const [projects, setProjects] = React.useState<string[]>(localStorage.getItem('projects') ? JSON.parse(localStorage.getItem('projects')!) : []);
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  const [prompts, setPrompts] = React.useState<string[]>(localStorage.getItem('prompts') ? JSON.parse(localStorage.getItem('prompts')!) : []);
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
  }, [prompts]);

  return (
    <>
      <Grid container spacing={2}>
        {/* Projects column */}
        <Grid item xs={4}>
          <Paper>
            <Typography variant="h6" component="h2">Projects</Typography>
            <List>
              {projects.map((project) => (
                <ListItem key={project}>
                  <Button onClick={() => setSelectedProject(project)}>{project}</Button>
                </ListItem>
              ))}
            </List>
            <Button onClick={() => {
              const newProject = prompt('Enter the name of the project');
              if (newProject) {
                setProjects([...projects, newProject]);
              }
            }}>Add project</Button>
          </Paper>
        </Grid>

        {/* Prompts column */}
        <Grid item xs={4}>
          <Paper>
            <Typography variant="h6" component="h2">Prompts</Typography>
            <List>
              {prompts.map((prompt) => (
                <ListItem key={prompt}>
                  <Button onClick={() => setSelectedPrompt(prompt)}>{prompt}</Button>
                </ListItem>
              ))}
            </List>
            <Button onClick={() => {
              const newPrompt = prompt('Enter the name of the prompt');
              if (newPrompt) {
                setPrompts([...prompts, newPrompt]);
              }
            }}>Add prompt</Button>
          </Paper>
        </Grid>
        {/* Show row at bottom if selectProject AND selectedPrompt */}
        {selectedProject && selectedPrompt && (
          <Grid item xs={12}>
            <Paper>
              <Typography variant="h6" component="h2">Selected</Typography>
              <Typography>Project: {selectedProject}</Typography>
              <Typography>Prompt: {selectedPrompt}</Typography>
              <Button onClick={() => {
                client.docker.cli.exec('docker', ['run'])
              }}>Run {selectedPrompt} in {selectedProject}</Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
}
