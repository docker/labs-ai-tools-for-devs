// Render turtle svg with badge

import React, { useState } from 'react';
import { Badge, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import gordon from '../gordon.png';
import { v1 } from '@docker/extension-api-client-types';
import { parse, stringify } from 'yaml';
import { tryRunImageSync, writeFilesToHost } from '../FileWatcher';

const DOCKER_MCP_CONFIG_YML = {
    services: {
        mcp_docker: {
            image: "alpine/socat",
            command: ["STDIO", "TCP:host.docker.internal:8811"],
            "x-mcp-autoremove": true
        }
    }
}

const Gordon: React.FC<{ client: v1.DockerDesktopClient }> = ({ client }) => {
    return (
        <>
            <Button sx={{ ml: 7 }} variant="outlined" color="primary" onClick={async () => {
                const dialogResult = await client.desktopUI.dialog.showOpenDialog({
                    title: "Save as Gordon MCP yml",
                    buttonLabel: "Save",
                    properties: ["openDirectory", "createDirectory"],
                })
                if (!dialogResult || dialogResult.canceled) {
                    return;
                }
                try {
                    const path = dialogResult.filePaths[0]
                    const result = await tryRunImageSync(client, ['--rm', '--mount', `type=bind,source="${path}",target=/project`, 'alpine:latest', 'ls', '-la', '/project'])
                    const files = result.split('\n').filter(line => line.trim() !== '').slice(1).map(line => line.split(' ').filter(Boolean).pop())
                    const has_gordon_mcp_yml = files.some(file => file?.toLowerCase().endsWith('gordon-mcp.yml'))
                    if (!has_gordon_mcp_yml) {
                        await writeFilesToHost(client, [{ path: 'gordon-mcp.yml', content: stringify(DOCKER_MCP_CONFIG_YML) }], [{ source: path, target: '/project' }], '/project')
                        client.desktopUI.toast.success(`Gordon MCP yml saved to ${path}/gordon-mcp.yml`)
                    }
                    else {
                        const current_config = await tryRunImageSync(client, ['--rm', '--mount', `type=bind,source="${path}",target=/project`, 'alpine:latest', 'cat', '/project/gordon-mcp.yml'])
                        const current_config_yaml = parse(current_config)
                        if (current_config_yaml.services.mcp_docker) {
                            return client.desktopUI.toast.error(`Found pre-configured mcp/docker at ${path}/gordon-mcp.yml`)
                        }
                        const new_config = {
                            ...current_config_yaml,
                            services: {
                                ...current_config_yaml.services,
                                mcp_docker: DOCKER_MCP_CONFIG_YML.services.mcp_docker
                            }
                        }
                        await writeFilesToHost(client, [{ path: 'gordon-mcp.yml', content: stringify(new_config) }], [{ source: path, target: '/project' }], '/project')
                        client.desktopUI.toast.success(`Gordon MCP yml updated in ${path}`)
                    }
                }
                catch (e) {
                    console.error(e)
                    client.desktopUI.toast.error(`Error saving Gordon MCP yml: ${e}`)
                }

            }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Save gordon-mcp.yml</Typography>
                    <img style={{ height: 30, width: 30 }} src={gordon} alt="Gordon" />
                </Stack>
            </Button>
        </>
    );
};

export default Gordon;
