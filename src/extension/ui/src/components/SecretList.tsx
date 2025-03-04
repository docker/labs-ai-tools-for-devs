// Secret list for the tab

import { Alert, List, ListItem, ListItemText, Typography } from "@mui/material";
import Secrets from "../Secrets";
import { DD_BUILD_WITH_SECRET_SUPPORT, getUnsupportedSecretMessage } from "../Constants";

export const SecretList = ({ secrets, ddVersion }: { secrets: Secrets.Secret[], ddVersion: { version: string, build: number } }) => {
    const hasDDVersionWithSecretSupport = ddVersion && ddVersion.build >= DD_BUILD_WITH_SECRET_SUPPORT;

    if (!hasDDVersionWithSecretSupport) {
        return <Alert severity="error" sx={{ fontSize: '1.2rem', maxWidth: 600 }}>{getUnsupportedSecretMessage(ddVersion)}</Alert>
    }

    return <List subheader={<Typography variant="h2">The following secrets are available to use in your prompts:</Typography>} sx={{ fontSize: '1.2rem' }}>
        {secrets.map((secret) => (
            <ListItem key={secret.name}>
                <ListItemText primary={<Typography variant="h6">{secret.name}</Typography>} />
            </ListItem>
        ))}
    </List>
}