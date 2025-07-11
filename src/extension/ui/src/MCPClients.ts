import { v1 } from "@docker/extension-api-client-types";
import ClaudeDesktop from "./mcp-clients/ClaudeDesktop";
import ContinueDotDev from "./mcp-clients/ContinueDotDev";
import Cursor from "./mcp-clients/Cursor";
import Gordon from "./mcp-clients/Gordon";
import VSCode from "./mcp-clients/VSCode";
import { MCPClient } from "./types/mcp";

export type MCPClientState = {
    client: MCPClient;
    exists: boolean;
    configured: boolean;
}

export const getMCPClientStates = async (ddClient: v1.DockerDesktopClient) => {
    const mcpClientStates: { [name: string]: MCPClientState } = {};

    try {
        const result = await ddClient.extension.host?.cli.exec("host-binary", ["client", "ls", "--global", "--json"]);
        if (result) {
            const fromCLI = JSON.parse(result.stdout);

            if (fromCLI["gordon"]) {
                mcpClientStates[Gordon.name] = toState(Gordon, fromCLI["gordon"]);
            }
            if (fromCLI["claude-desktop"]) {
                mcpClientStates[ClaudeDesktop.name] = toState(ClaudeDesktop, fromCLI["claude-desktop"]);
            }
            if (fromCLI["cursor"]) {
                mcpClientStates[Cursor.name] = toState(Cursor, fromCLI["cursor"]);
            }
            if (fromCLI["continue"]) {
                mcpClientStates[ContinueDotDev.name] = toState(ContinueDotDev, fromCLI["continue"]);
            }
            if (fromCLI["vscode"]) {
                mcpClientStates[VSCode.name] = toState(VSCode, fromCLI["vscode"]);
            }
        }
    } catch (e) {
        ddClient.desktopUI.toast.error("Unable to connect Claude Desktop");
    }
    return mcpClientStates;
}

function toState(client: MCPClient, config: any): MCPClientState {
    return {
        client: client,
        exists: config["isInstalled"],
        configured: config["dockerMCPCatalogConnected"],
    };
}

