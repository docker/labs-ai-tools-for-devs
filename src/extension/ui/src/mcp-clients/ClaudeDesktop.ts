import { v1 } from "@docker/extension-api-client-types";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";

class ClaudeDesktopClient implements MCPClient {
  name = "Claude Desktop";
  url = "https://claude.ai/download";
  manualConfigSteps = [
    "Select <strong>Claude Settings</strong>",
    "Click on the <strong>Developer</strong> tab",
    "Click on the <strong>Edit Config</strong> button",
    "Add MCP_DOCKER to <code>mcpServers</code> section:" +
    '<pre style="font-family: monospace; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
    JSON.stringify(SAMPLE_MCP_CONFIG, null, 2) +
    "</pre>",
  ];
  expectedConfigPath = {
    darwin:
      "/Users/$USER/Library/Application Support/Claude/claude_desktop_config.json",
    linux: "/home/$USER/.config/claude/claude_desktop_config.json",
    win32: "%APPDATA%\\Claude\\claude_desktop_config.json",
  };
  connect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "connect", "--global", "claude-desktop"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to connect Claude Desktop");
    }
  };
  disconnect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "disconnect", "--global", "claude-desktop"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to disconnect Claude Desktop");
    }
  };
}

export default new ClaudeDesktopClient();
