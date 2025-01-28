// React component using MUI to display the status of the Claude config

import { v1 } from "@docker/extension-api-client-types";
import { DockerDesktopClient } from "@docker/extension-api-client-types/dist/v0";
import { Badge, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { getRegistry } from "../Registry";
import { stopWatch, watchFile } from "../FileWatcher";

const statusMap = {
    0: {
        label: 'Idle...',
        color: 'primary',
    },
    1: {
        label: 'Synced',
        color: 'success',
    },
    2: {
        label: 'Out of Sync',
        color: 'error',
    },
    3: {
        label: '?',
        color: 'warning',
    },
    4: {
        label: 'Loading...',
        color: 'primary',
    },
    5: {
        label: 'Error',
        color: 'error',
    },
}

export const RegistrySyncStatus = ({ registryLoaded }: { registryLoaded: boolean }) => {
    const [status, setStatus] = useState<keyof typeof statusMap>(0);

    useEffect(() => {
        if (registryLoaded) {
            setStatus(1)
        }
    }, [registryLoaded]);

    return <Badge badgeContent={statusMap[status].label} color={statusMap[status].color as any} sx={{ ml: 1 }} title={statusMap[status].label}>
        <div style={{ width: 40, height: 'auto', margin: 5 }}>
            {/* yaml logo for icon */}
            <img src="https://www.svgrepo.com/show/524492/database.svg" alt="database" style={{ height: 40, backgroundColor: 'white', borderRadius: 8 }} />
        </div>
    </Badge>
}