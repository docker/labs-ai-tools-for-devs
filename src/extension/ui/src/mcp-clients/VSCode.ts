import { v1 } from "@docker/extension-api-client-types";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";

class VSCodeClient implements MCPClient {
  name = "Visual Studio Code";
  url = "https://code.visualstudio.com/download";
  manualConfigSteps = [
    "Open <strong>VS Code Settings</strong> (File > Preferences > Settings or Ctrl+,)",
    "Click on <strong>Open Settings (JSON)</strong> in the top right corner",
    "Add MCP configuration to the <code>settings.json</code> file:",
    '<pre style="font-family: monospace; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
    JSON.stringify({
      "mcp.servers": SAMPLE_MCP_CONFIG.mcpServers
    }, null, 2) +
    "</pre>",
    "Save the settings file and restart VS Code if necessary"
  ];
  expectedConfigPath = {
    darwin: "$HOME/Library/Application Support/Code/User/settings.json",
    linux: "$HOME/.config/Code/User/settings.json",
    win32: "$APPDATA\\Code\\User\\settings.json",
  };
  connect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "connect", "--global", "vscode"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to connect Visual Studio Code");
    }
  };
  disconnect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "disconnect", "--global", "vscode"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to disconnect Visual Studio Code");
    }
  };
}

export default new VSCodeClient();