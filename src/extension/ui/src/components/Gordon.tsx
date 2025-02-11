// Render turtle svg with badge

import React, { useState } from 'react';
import { Badge, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import gordon from '../gordon.png';
import { v1 } from '@docker/extension-api-client-types';
import { parse, stringify } from 'yaml';
import { writeFilesToHost } from '../FileWatcher';

const DOCKER_MCP_CONFIG_YML = {
    services: {
        mcp_docker: {
            image: "mcp/docker",
            command: ["serve", "--mcp", "--register", "github:docker/labs-ai-tools-for-devs?path=prompts/bootstrap.md"],
            volumes: ["/var/run/docker.sock:/var/run/docker.sock", "docker-prompts:/prompts"],
            "x-mcp-autoremove": true,
        }
    },
    volumes: {
        docker_prompts: {
            external: false
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
                    const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/project`, 'alpine:latest', 'ls', '-la', '/project'])
                    const files = result.stdout.split('\n').filter(line => line.trim() !== '').slice(1).map(line => line.split(' ').filter(Boolean).pop())
                    const has_gordon_mcp_yml = files.some(file => file?.toLowerCase().endsWith('gordon-mcp.yml'))
                    if (!has_gordon_mcp_yml) {
                        await writeFilesToHost(client, [{ path: 'gordon-mcp.yml', content: stringify(DOCKER_MCP_CONFIG_YML) }], [{ source: path, target: '/project' }], '/project')
                        client.desktopUI.toast.success(`Gordon MCP yml saved to ${path}`)
                    }
                    else {
                        const current_config = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source="${path}",target=/project`, 'alpine:latest', 'cat', '/project/gordon-mcp.yml'])
                        const current_config_yaml = parse(current_config.stdout)
                        if (current_config_yaml.services.mcp_docker) {
                            return client.desktopUI.toast.error(`You already have mcp/docker configured in ${path}`)
                        }
                        const new_config = {
                            ...current_config_yaml,
                            services: {
                                ...current_config_yaml.services,
                                mcp_docker: DOCKER_MCP_CONFIG_YML.services.mcp_docker
                            },
                            volumes: {
                                ...current_config_yaml.volumes,
                                docker_prompts: DOCKER_MCP_CONFIG_YML.volumes.docker_prompts
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
