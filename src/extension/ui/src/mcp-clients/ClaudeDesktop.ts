import { v1 } from "@docker/extension-api-client-types";
import { BUSYBOX } from "../Constants";
import { getUser } from "../utils/Files";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";

class ClaudeDesktopClient implements MCPClient {
  name = "Claude Desktop";
  url = "https://claude.ai/download";
  manualConfigSteps = [
    "Open Claude Desktop",
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
  readConfig = async (client: v1.DockerDesktopClient) => {
    const platform = client.host.platform;
    let path = "";
    switch (platform) {
      case "darwin":
        path =
          "/Users/$USER/Library/Application Support/Claude/claude_desktop_config.json";
        break;
      case "linux":
        path = "/home/$USER/.config/claude/claude_desktop_config.json";
        break;
      case "win32":
        path = "%APPDATA%\\Claude\\claude_desktop_config.json";
        break;
      default:
        throw new Error("Unsupported platform: " + platform);
    }
    const user = await getUser(client);
    path = path.replace("$USER", user);
    try {
      const result = await client.docker.cli.exec("run", [
        "--rm",
        "--mount",
        `type=bind,source="${path}",target=/config.json`,
        BUSYBOX,
        "/bin/cat",
        "/config.json",
      ]);
      return { content: result.stdout || undefined, path: path };
    } catch (e) {
      return { content: null, path: path };
    }
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
  validateConfig = (content: string) => {
    const config = JSON.parse(content || "{}");
    return !!config.mcpServers?.MCP_DOCKER;
  };
}

export default new ClaudeDesktopClient();
