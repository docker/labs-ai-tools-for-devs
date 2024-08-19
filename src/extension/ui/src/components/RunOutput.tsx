import React from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import Convert from 'ansi-to-html';

const convert = new Convert({ newline: true });

type RunOutputProps = {
    runOut: any[];
    showDebug: boolean;
    setShowDebug: (show: boolean) => void;
};

const RunOutput: React.FC<RunOutputProps> = ({ runOut, showDebug, setShowDebug }) => (
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
);

export default RunOutput;