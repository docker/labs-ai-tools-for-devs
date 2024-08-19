import React from 'react';
import { Button, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import DelIcon from '@mui/icons-material/Delete';
import { createDockerDesktopClient } from '@docker/extension-api-client';

const client = createDockerDesktopClient();

type ProjectsProps = {
    projects: string[];
    selectedProject: string | null;
    setProjects: (projects: string[]) => void;
    setSelectedProject: (project: string) => void;
};

const Projects: React.FC<ProjectsProps> = ({ projects, selectedProject, setProjects, setSelectedProject }) => {
    const delim = client.host.platform === 'win32' ? '\\' : '/';

    return (
        <Paper sx={{ padding: 1 }}>
            <Typography variant='h3'>My Projects</Typography>
            <Stack direction='row' spacing={1} sx={{ mt: 1 }} alignItems={'center'} justifyContent={'space-between'}>
                <Button sx={{ padding: 1 }} onClick={() => {
                    client.desktopUI.dialog.showOpenDialog({
                        properties: ['openDirectory', 'multiSelections']
                    }).then((result) => {
                        if (result.canceled) {
                            return;
                        }
                        const newProjects = result.filePaths;
                        setProjects([...projects, ...newProjects]);
                    });
                }}>
                    Import projects
                </Button>
            </Stack>
            <List>
                {projects.map((project) => (
                    <ListItem
                        key={project}
                        sx={theme => ({ borderLeft: 'solid black 3px', borderColor: selectedProject === project ? theme.palette.success.main : 'none', my: 0.5, padding: 0 })}
                        secondaryAction={
                            <IconButton color='error' onClick={() => {
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
    );
};

export default Projects;