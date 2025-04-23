import { v1 } from "@docker/extension-api-client-types";
import { escapeJSONForPlatformShell, getUser } from "../FileUtils";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";
import { DOCKER_MCP_COMMAND } from "../Constants";
import { mergeDeep } from "../MergeDeep";
import { parse, stringify } from "yaml";
class ContinueDotDev implements MCPClient {
    name = 'Continue.dev';
    url = 'https://continue.dev/';
    manualConfigSteps = [
        'Open <strong>Continue.dev Settings </strong>',
        'in your global .continue folder (~/.continue on Mac, %USERPROFILE%\.continue) within .continue/assistants. The name of the file will be used as the display name of the assistant, e.g. My Assistant.yaml',
        'Add block mcpServers:',
        stringify(SAMPLE_MCP_CONFIG)
    ];
    expectedConfigPath = {
        darwin: '$HOME/.continue/config.yaml',
        linux: '$HOME/.continue/config.yaml',
        win32: '$USERPROFILE\\.continue\\config.yaml'
    };
    readConfig = async (client: v1.DockerDesktopClient) => {
        const platform = client.host.platform as keyof typeof this.expectedConfigPath;
        const configPath = this.expectedConfigPath[platform].replace('$USER', await getUser(client));
        try {
            const result = await client.docker.cli.exec('run', ['--rm', '--mount', `type=bind,source=${configPath},target=/continue/config.yaml`, 'alpine:latest', 'cat', '/continue/config.yaml']);
            return {
                content: result.stdout,
                path: configPath
            };
        } catch (e) {
            return {
                content: null,
                path: configPath
            };
        }
    };
    connect = async (client: v1.DockerDesktopClient) => {
        const config = await this.readConfig(client);
        let continueConfig = null;
        try {
            continueConfig = parse(config.content || '') as typeof SAMPLE_MCP_CONFIG;
            if (continueConfig.mcpServers?.MCP_DOCKER) {
                client.desktopUI.toast.success('Continue.dev MCP server already connected.');
                return;
            }
        } catch (e) {
            continueConfig = mergeDeep({}, SAMPLE_MCP_CONFIG);
        }
        const payload = mergeDeep(continueConfig, SAMPLE_MCP_CONFIG);
        try {
            await client.docker.cli.exec('run',
                [
                    '--rm',
                    '--mount',
                    `type=bind,source="${config.path}",target=/continue/config.yaml`,
                    '--workdir',
                    '/continue', 'vonwig/function_write_files:latest',
                    escapeJSONForPlatformShell({ files: [{ path: 'config.yaml', content: stringify(payload) }] }, client.host.platform)
                ]
            );
            client.desktopUI.toast.success('Connected Continue.dev MCP Server.');
        } catch (e) {
            if ((e as any).stderr) {
                client.desktopUI.toast.error((e as any).stderr);
            } else {
                client.desktopUI.toast.error((e as Error).message);
            }
        }
    };
    disconnect = async (client: v1.DockerDesktopClient) => {
        const config = await this.readConfig(client);
        if (!config.content) {
            client.desktopUI.toast.error('No config found');
            return;
        }
        let continueConfig = null;
        try {
            continueConfig = parse(config.content) as typeof SAMPLE_MCP_CONFIG;
            if (!continueConfig.mcpServers?.MCP_DOCKER) {
                client.desktopUI.toast.error('Docker MCP Server not connected to Continue.dev');
                return;
            }
        } catch (e) {
            client.desktopUI.toast.error('Failed to disconnect. Invalid Continue.dev config found at ' + config.path);
            return;
        }
        const payload = {
            ...continueConfig,
            mcpServers: Object.fromEntries(Object.entries(continueConfig.mcpServers).filter(([key]) => key !== 'MCP_DOCKER'))
        };
        try {
            await client.docker.cli.exec('run',
                [
                    '--rm',
                    '--mount',
                    `type=bind,source="${config.path}",target=/continue/config.yaml`,
                    '--workdir',
                    '/continue', 'vonwig/function_write_files:latest',
                    escapeJSONForPlatformShell({ files: [{ path: 'config.yaml', content: stringify(payload) }] }, client.host.platform)
                ]
            );
        } catch (e) {
            if ((e as any).stderr) {
                client.desktopUI.toast.error((e as any).stderr);
            } else {
                client.desktopUI.toast.error((e as Error).message);
            }
        }
    };
    validateConfig = (content: string) => {
        const config = JSON.parse(content || '{}') as typeof SAMPLE_MCP_CONFIG;
        return !!config.mcpServers?.MCP_DOCKER;
    };
}

export default new ContinueDotDev();
