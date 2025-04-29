import { v1 } from "@docker/extension-api-client-types";
import { DOCKER_MCP_COMMAND } from "../Constants";
import { MCPClient } from "./MCPTypes";

class CursorDesktopClient implements MCPClient {
  name = "Cursor";
  url = "https://www.cursor.com/downloads";
  manualConfigSteps = [
    "Open <strong>Cursor Settings</strong>",
    "Click on the <strong>MCP</strong> tab",
    "Click on the <strong>Add new MCP server</strong> button",
    "Set name: <code>MCP_DOCKER</code>",
    'Set command: <pre style="font-family: monospace; white-space: nowrap; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
    DOCKER_MCP_COMMAND +
    "</pre>",
  ];
  expectedConfigPath = {
    darwin: "$HOME/.cursor/mcp.json",
    linux: "$HOME/.cursor/mcp.json",
    win32: "$USERPROFILE\\.cursor\\mcp.json",
  };
  connect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "connect", "--global", "cursor"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to connect Cursor");
    }
  };
  disconnect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "disconnect", "--global", "cursor"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to connect Cursor");
    }
  };
}

export default new CursorDesktopClient();
