import { v1 } from "@docker/extension-api-client-types";
import { MCPClient } from ".";
import { DOCKER_MCP_COMMAND, DOCKER_MCP_CONTAINER_ARGS, DOCKER_MCP_IMAGE } from "../Constants";
import { stringify } from "yaml";


const DOCKER_MCP_CONFIG_YAML = stringify({
    services: {
        MCP_DOCKER: {
            image: DOCKER_MCP_IMAGE,
            command: DOCKER_MCP_CONTAINER_ARGS.split(' ')
        }
    }
})

const gordonConfigPathPlaceholder = 'gordon-mcp.yml in the directory you want to connect to'

class GordonMCPClient implements MCPClient {
    name = 'Gordon';
    url = 'https://docs.docker.com/desktop/features/gordon/';
    manualConfigSteps = [
        'Enable Gordon in Docker Desktop',
        'Write gordon-mcp.yml to the directory you want to connect to',
        'Add MCP_DOCKER to the <code>services</code> section:' +
        '<pre style="font-family: monospace; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
        DOCKER_MCP_CONFIG_YAML +
        '</pre>'
    ]
    expectedConfigPath = {
        darwin: gordonConfigPathPlaceholder,
        linux: gordonConfigPathPlaceholder,
        win32: gordonConfigPathPlaceholder
    }
    readFile = async (client: v1.DockerDesktopClient) => {
        return {
            path: this.expectedConfigPath[client.host.platform as 'darwin' | 'linux' | 'win32'],
            content: null
        }
    }
    connect = async (client: v1.DockerDesktopClient) => {
        return Promise.resolve();
    }
    disconnect = async (client: v1.DockerDesktopClient) => {
        return Promise.resolve();
    }
    validateConfig = (content: string) => {
        return true;
    }


}

export default new GordonMCPClient();