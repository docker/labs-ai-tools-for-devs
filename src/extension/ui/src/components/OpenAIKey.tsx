import React from 'react';
import { Paper, TextField, Typography } from '@mui/material';

type OpenAIKeyProps = {
    openAIKey: string;
    setOpenAIKey: (key: string) => void;
};

const OpenAIKey: React.FC<OpenAIKeyProps> = ({ openAIKey, setOpenAIKey }) => (
    <Paper sx={{ padding: 1 }}>
        <Typography variant='h3'>OpenAI Key</Typography>
        <TextField
            sx={{ mt: 1, width: '100%' }}
            onChange={e => setOpenAIKey(e.target.value)}
            value={openAIKey || ''}
            placeholder='Enter OpenAI API key'
            type='password'
        />
    </Paper>
);

export default OpenAIKey;