import React from 'react';
import { Alert, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Secrets from '../../Secrets';
import { DD_BUILD_WITH_SECRET_SUPPORT, getUnsupportedSecretMessage } from '../../Constants';

interface YourEnvironmentProps {
    secrets: Secrets.Secret[];
    ddVersion: { version: string, build: number };
    config: { [key: string]: { [key: string]: any } };
}

const YourEnvironment: React.FC<YourEnvironmentProps> = ({ secrets, ddVersion, config }) => {
    const hasDDVersionWithSecretSupport = ddVersion && ddVersion.build >= DD_BUILD_WITH_SECRET_SUPPORT;

    if (!hasDDVersionWithSecretSupport) {
        return <Alert severity="error" sx={{ fontSize: '1.2rem', maxWidth: 600 }}>{getUnsupportedSecretMessage(ddVersion)}</Alert>
    }

    return (
        <Stack direction="column" spacing={2}>
            <List subheader={
                <Stack direction="column" spacing={2} alignItems="center">
                    <Alert title="Docker Secret Management" severity="info" sx={{ fontSize: '1.2rem', maxWidth: 600 }}>
                        Docker Secret Management is a new feature in Docker Desktop that allows you to securely inject secrets into your containers.
                    </Alert>
                    <Typography variant="h2">
                        The following secrets are available to use in your prompts:
                    </Typography>
                </Stack>
            }>
                {secrets.map((secret) => (
                    <ListItem key={secret.name}>
                        <ListItemText primary={<Typography variant="h6">{secret.name}</Typography>} />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h2">The following configurations are available to use in your prompts:</Typography>
            <pre>{JSON.stringify(config, null, 2)}</pre>
        </Stack>
    );
};

export default YourEnvironment; 