import { v1 } from "@docker/extension-api-client-types";
import useOAuthProvider from "../../queries/useOAuthProvider";
import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Collapse, Link, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { OAuthClient } from "../../types/oauth/Client";

const OAuthProviders = ({ client }: { client: v1.DockerDesktopClient }) => {
    const { data, isLoading, error, authorizeOAuthProvider, unauthorizeOAuthProvider } = useOAuthProvider(client);
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading OAuth Providers...</Typography>
            <CircularProgress />
        </Box>;
    }
    if (error) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Alert severity="error">Error: {error.message || JSON.stringify(error, null, 2)}</Alert>
        </Box>;
    }
    if (!data) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Alert severity="info">No supported OAuth Providers detected</Alert>
        </Box>;
    }
    if (data.length > 0) {
        return <>
            {data.map((provider: OAuthClient) => {
                return <Card>
                    <CardHeader title={provider.app} action={provider.authorized ? <Button variant="contained" color="error" onClick={() => {
                        unauthorizeOAuthProvider.mutateAsync(provider.app);
                    }}>Unauthorize</Button> : <Button variant="contained" color="success" onClick={() => {
                        authorizeOAuthProvider.mutateAsync(provider.app);
                    }}>Authorize</Button>} />
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>{provider.provider}</Typography>
                            {provider.authorized ? <Chip label="Authorized" color="success" size="small" /> : <Chip label="Unauthorized" color="error" size="small" />}
                        </Stack>
                    </CardContent>
                </Card>
            })}
        </>
    }
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Alert severity="info">No supported OAuth Providers detected</Alert>
    </Box>;
};

export default OAuthProviders;

