import { v1 } from "@docker/extension-api-client-types";
import { MCPClient, SUPPORTED_MCP_CLIENTS } from "./Constants";

export interface MCPClientState extends MCPClient {
    exists: boolean;
    configured: boolean;
    path: string;
}

export const getMCPClientStates = async (ddClient: v1.DockerDesktopClient) => {
    const mcpClientStates: { [name: string]: MCPClientState } = {};
    for (const mcpClient of SUPPORTED_MCP_CLIENTS) {
        const { path, content } = await mcpClient.readFile(ddClient);
        if (content === null) {
            mcpClientStates[mcpClient.name] = { exists: false, configured: false, path, ...mcpClient };
        } else if (content === undefined) {
            mcpClientStates[mcpClient.name] = { exists: true, configured: false, path, ...mcpClient };
        }
        else {
            mcpClientStates[mcpClient.name] = { exists: true, configured: mcpClient.validateConfig(content), path: path, ...mcpClient };
        }
    }
    return mcpClientStates;
}