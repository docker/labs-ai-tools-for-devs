import React from 'react';
import { Alert, Box, Card, CardContent, CardHeader, Grid2, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { DD_BUILD_WITH_SECRET_SUPPORT, getUnsupportedSecretMessage } from '../../Constants';
import { Secret } from '../../types/secrets';

interface YourEnvironmentProps {
    secrets: Secret[];
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

            <Stack direction="column" spacing={2}>

                <Typography variant="h3">
                    The following secrets are available to use in your prompts:
                </Typography>
                <Alert title="Docker Secret Management" severity="info" sx={{ width: '90vw', maxWidth: 1000, p: 1 }}>
                    Docker Secret Management is a new feature in Docker Desktop that allows you to securely inject secrets into your containers. Only the tools which need to access the secrets will be able to access them.
                </Alert>
            </Stack>
            <Grid2 container spacing={1}>
                {secrets.sort((a, b) => a.name.localeCompare(b.name)).map((secret) => (
                    <Grid2 key={secret.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card raised sx={{ py: 0, px: 2 }}>
                            <pre>{secret.name}</pre>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
            <Typography variant="h3">The following configurations are available to use in your prompts:</Typography>
            <Grid2 container spacing={1}>
                {Object.keys(config).sort().map((key) => (
                    <Grid2 key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card raised sx={{ py: 1, px: 2 }}>
                            <Typography variant="h6">{key}</Typography>
                            <Box sx={{ overflow: 'auto', maxHeight: 200, backgroundColor: 'background.secondary', borderRadius: 2, p: 1, mt: 1 }}>
                                <pre style={{ margin: 0 }}>{JSON.stringify(config[key], null, 2)}</pre>
                            </Box>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Stack >
    );
};

export default YourEnvironment; 