import React from 'react';
import { Button, Chip, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material';
import DelIcon from '@mui/icons-material/Delete';
import { createDockerDesktopClient } from '@docker/extension-api-client';

const client = createDockerDesktopClient();

type PromptsProps = {
    prompts: string[];
    selectedPrompt: string | null;
    promptInput: string;
    setPrompts: (prompts: string[]) => void;
    setSelectedPrompt: (prompt: string) => void;
    setPromptInput: (input: string) => void;
    track: (event: string) => void;
};

const Prompts: React.FC<PromptsProps> = ({ prompts, selectedPrompt, promptInput, setPrompts, setSelectedPrompt, setPromptInput, track }) => {
    const delim = client.host.platform === 'win32' ? '\\' : '/';

    return (
        <Paper sx={{ padding: 1 }}>
            <Typography variant="h3">My Prompts</Typography>
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
                        track('DockerPromptsAddPrompt');
                    }}>Import prompt</Button>
                )}
                <Button onClick={() => {
                    client.desktopUI.dialog.showOpenDialog({
                        title: 'Select prompt',
                        properties: ['openDirectory', 'openFile', 'multiSelections'],
                        filters: [{ name: 'Markdown', extensions: ['.md'] }],
                    }).then((result) => {
                        if (result.canceled) {
                            return;
                        }
                        track('DockerPromptsAddLocalPrompt');
                        setPrompts([...prompts, ...result.filePaths.map(p => `local://${p}`)]);
                        setSelectedPrompt(`local://${result.filePaths[0]}`);
                    });
                }}>Add local prompt(s)</Button>
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
    );
};

export default Prompts;