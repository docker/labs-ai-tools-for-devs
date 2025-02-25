import { v1 } from "@docker/extension-api-client-types";
import { MCPClient, SUPPORTED_MCP_CLIENTS } from "./Constants";

export interface MCPClientState extends MCPClient {
    exists: boolean;
    configured: boolean;
}

export const getMCPClientStates = async (ddClient: v1.DockerDesktopClient) => {
    const mcpClientStates: { [name: string]: MCPClientState } = {};
    for (const mcpClient of SUPPORTED_MCP_CLIENTS) {
        const file = await mcpClient.readFile(ddClient);
        if (file === null) {
            mcpClientStates[mcpClient.name] = { exists: false, configured: false, ...mcpClient };
        } else if (file === undefined) {
            mcpClientStates[mcpClient.name] = { exists: true, configured: false, ...mcpClient };
        }
        else {
            mcpClientStates[mcpClient.name] = { exists: true, configured: mcpClient.validateConfig(file), ...mcpClient };
        }
    }
    return mcpClientStates;
}