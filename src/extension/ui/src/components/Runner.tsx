import { Paper, Typography, Button } from '@mui/material';
import { useEffect } from 'react';

type RunnerProps = {
    selectedProject: string | null;
    selectedPrompt: string | null;
    openAIKey: string | null;
    startPrompt: () => void;
    renderPrompt: () => void;
}

const Runner: React.FC<RunnerProps> = ({ selectedProject, selectedPrompt, openAIKey, startPrompt, renderPrompt }) => {
    useEffect(() => {
        if (selectedProject && selectedPrompt && openAIKey) {
            // renderPrompt();
        }
    }, [selectedProject, selectedPrompt, openAIKey]);

    return selectedProject && selectedPrompt && openAIKey ? (
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
    )
}

export default Runner;