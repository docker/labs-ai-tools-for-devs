import { v1 } from "@docker/extension-api-client-types";
import { SUPPORTED_MCP_CLIENTS } from "./mcp-clients";
import { MCPClient } from "./types/mcp";

export type MCPClientState = {
    client: MCPClient;
    exists: boolean;
    configured: boolean;
    path: string;
    preventAutoConnectMessage?: string;
}

export const getMCPClientStates = async (ddClient: v1.DockerDesktopClient) => {
    const mcpClientStates: { [name: string]: MCPClientState } = {};
    for (const mcpClient of SUPPORTED_MCP_CLIENTS) {
        const { path, content } = await mcpClient.readConfig(ddClient);
        if (content === null) {
            mcpClientStates[mcpClient.name] = { exists: false, configured: false, path, client: mcpClient };
        } else if (content === undefined) {
            mcpClientStates[mcpClient.name] = { exists: true, configured: false, path, client: mcpClient };
        }
        else {
            mcpClientStates[mcpClient.name] = { exists: true, configured: mcpClient.validateConfig(content), path: path, client: mcpClient };
        }
    }
    return mcpClientStates;
}