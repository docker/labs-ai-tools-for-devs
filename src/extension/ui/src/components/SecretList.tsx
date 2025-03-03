// Secret list for the tab

import { List, ListItem, ListItemText } from "@mui/material";
import Secrets from "../Secrets";

export const SecretList = ({ secrets }: { secrets: Secrets.Secret[] }) => {
    return <List>
        {secrets.map((secret) => (
            <ListItem key={secret.name}>
                <ListItemText primary={secret.name} />
            </ListItem>
        ))}
    </List>
}