import { v1 } from "@docker/extension-api-client-types";
import { SUPPORTED_MCP_CLIENTS } from "./Constants";

export type MCPClientState = {
    exists: boolean;
    configured: boolean;
    error?: string;
}

export const getMCPClientStates = async (ddClient: v1.DockerDesktopClient) => {
    const mcpClientStates: { [name: string]: MCPClientState } = {};
    for (const mcpClient of SUPPORTED_MCP_CLIENTS) {
        const file = await mcpClient.readFile(ddClient);
        if (file === null) {
            mcpClientStates[mcpClient.name] = { exists: false, configured: false };
        } else if (file === undefined) {
            mcpClientStates[mcpClient.name] = { exists: true, configured: false };
        }
        else {
            mcpClientStates[mcpClient.name] = { exists: true, configured: mcpClient.checkConfig(file) };
        }
    }
    return mcpClientStates;
}