import { DOCKER_MCP_COMMAND } from "../Constants";
import { v1 } from "@docker/extension-api-client-types";
export type MCPClient = {
    name: string;
    url: string;
    readFile: (client: v1.DockerDesktopClient) => Promise<{ content: string | null | undefined, path: string }>;
    connect: (client: v1.DockerDesktopClient) => Promise<void>;
    disconnect: (client: v1.DockerDesktopClient) => Promise<void>;
    validateConfig: (content: string) => boolean;
    expectedConfigPath: { [key in 'win32' | 'darwin' | 'linux']: string };
    manualConfigSteps: string[];
}

export const SAMPLE_MCP_CONFIG = {
    mcpServers: {
        MCP_DOCKER: {
            "command": DOCKER_MCP_COMMAND.split(' ')[0],
            "args": DOCKER_MCP_COMMAND.split(' ').slice(1),
        }
    }
}
