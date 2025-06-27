import { v1 } from "@docker/extension-api-client-types";
import { DOCKER_MCP_COMMAND } from "../Constants";
import { MCPClient } from "./MCPTypes";

class VSCodeClient implements MCPClient {
    name = "VS Code";
    url = "https://code.visualstudio.com/download";
    manualConfigSteps = [
        "Open Command Palette (Ctrl/Cmd + Shift + P) and run <code>MCP: Add Server</code>",
        "Select <code>Command (stdio)</code> as the server type",
        "Set server name: <code>MCP_DOCKER</code>",
        "Paste the command: " +
        '<pre style="font-family: monospace; white-space: nowrap; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
        DOCKER_MCP_COMMAND +
        "</pre>",
        "Choose <strong>Workspace Settings</strong> or <strong>User Settings</strong> based on your preference",
        "Open the <strong>Chat view</strong> (Ctrl/Cmd + Shift + I) and select <strong>Agent mode</strong>",
        "Click the <strong>Tools</strong> button to verify MCP_DOCKER tools are available"
    ];
    expectedConfigPath = {
        darwin: ".vscode/mcp.json or $HOME/Library/Application Support/Code/User/settings.json",
        linux: ".vscode/mcp.json or $HOME/.config/Code/User/settings.json",
        win32: ".vscode\\mcp.json or %APPDATA%\\Code\\User\\settings.json",
    };
    connect = async (client: v1.DockerDesktopClient) => {
        try {
            await client.extension.host?.cli.exec("host-binary", ["client", "connect", "--global", "vscode"]);
        } catch (e) {
            client.desktopUI.toast.error("Unable to connect VS Code");
        }
    };
    disconnect = async (client: v1.DockerDesktopClient) => {
        try {
            await client.extension.host?.cli.exec("host-binary", ["client", "disconnect", "--global", "vscode"]);
        } catch (e) {
            client.desktopUI.toast.error("Unable to disconnect VS Code");
        }
    };
}

export default new VSCodeClient();
