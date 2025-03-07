import { v1 } from "@docker/extension-api-client-types";
import { SUPPORTED_MCP_CLIENTS } from "./mcp-clients";
import { MCPClient } from "./mcp-clients";

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
        if (mcpClient.name === 'Gordon') {
            mcpClientStates[mcpClient.name] = { exists: true, configured: true, path: 'gordon-mcp.yml', client: mcpClient, preventAutoConnectMessage: 'Gordon must be manually connected with a yaml file.' };
            continue;
        }
        const { path, content } = await mcpClient.readFile(ddClient);
        if (content === null) {
            mcpClientStates[mcpClient.name] = { exists: false, configured: false, path, client: mcpClient };
        } else if (content === undefined) {
            mcpClientStates[mcpClient.name] = { exists: true, configured: false, path, client: mcpClient };
        }
        else {
            mcpClientStates[mcpClient.name] = { exists: true, configured: mcpClient.validateConfig(content), path: path, client: mcpClient };
        }
        if (mcpClient.name === 'Cursor') {
            mcpClientStates[mcpClient.name].preventAutoConnectMessage = 'Connecting Cursor automatically is not yet supported. Please configure manually in Cursor Settings.';
        }
    }
    return mcpClientStates;
}