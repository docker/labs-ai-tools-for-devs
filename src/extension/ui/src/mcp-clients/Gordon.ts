import { v1 } from "@docker/extension-api-client-types";
import { stringify } from "yaml";
import { DOCKER_MCP_CONTAINER_ARGS, DOCKER_MCP_IMAGE } from "../Constants";
import { MCPClient } from "./MCPTypes";

const DOCKER_MCP_CONFIG_YAML = stringify({
    services: {
        MCP_DOCKER: {
            image: DOCKER_MCP_IMAGE,
            command: DOCKER_MCP_CONTAINER_ARGS.split(' ')
        }
    }
})

class GordonMCPClient implements MCPClient {
    name = 'Gordon';
    url = 'https://docs.docker.com/desktop/features/gordon/mcp/yaml/';
    manualConfigSteps = [
        'Enable Gordon in Docker Desktop',
        'Write <code>gordon-mcp.yml</code> to the directory you want to connect to',
        'Add MCP_DOCKER to the <code>services</code> section:' +
        '<pre style="font-family: monospace; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
        DOCKER_MCP_CONFIG_YAML +
        '</pre>'
    ]
    connect = async (client: v1.DockerDesktopClient) => {
        try {
            await client.docker.cli.exec('ai', ['config', 'set-feature', '"MCP Catalog"', 'true'])
        } catch (e) {
            if ((e as any).stderr) {
                client.desktopUI.toast.error((e as any).stderr)
            } else {
                client.desktopUI.toast.error((e as Error).message)
            }
        }
    }
    disconnect = async (client: v1.DockerDesktopClient) => {
        try {
            await client.docker.cli.exec('ai', ['config', 'set-feature', '"MCP Catalog"', 'false'])
        } catch (e) {
            if ((e as any).stderr) {
                client.desktopUI.toast.error((e as any).stderr)
            } else {
                client.desktopUI.toast.error((e as Error).message)
            }
        }
    }
}

export default new GordonMCPClient();