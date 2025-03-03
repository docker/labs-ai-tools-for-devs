// Secret list for the tab

import { List, ListItem, ListItemText, Typography } from "@mui/material";
import Secrets from "../Secrets";

export const SecretList = ({ secrets }: { secrets: Secrets.Secret[] }) => {
    return <List subheader={<Typography variant="h2">The following secrets are available to use in your prompts:</Typography>} sx={{ fontSize: '1.2rem' }}>
        {secrets.map((secret) => (
            <ListItem key={secret.name}>
                <ListItemText primary={<Typography variant="h6">{secret.name}</Typography>} />
            </ListItem>
        ))}
    </List>
}