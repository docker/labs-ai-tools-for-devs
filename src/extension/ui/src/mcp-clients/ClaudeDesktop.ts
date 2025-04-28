import { v1 } from "@docker/extension-api-client-types";
import { BUSYBOX } from "../Constants";
import { getUser, writeToMount } from "../utils/Files";
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
    const platform = client.host.platform;
    let path = "";
    switch (platform) {
      case "darwin":
        path = "/Users/$USER/Library/Application Support/Claude/";
        break;
      case "linux":
        path = "/home/$USER/.config/claude/";
        break;
      case "win32":
        path = "%APPDATA%\\Claude\\";
        break;
      default:
        throw new Error("Unsupported platform: " + platform);
    }
    const user = await getUser(client);
    path = path.replace("$USER", user);

    let payload: Record<string, any> = {};
    try {
      const result = await client.docker.cli.exec("run", [
        "--rm",
        "--mount",
        `type=bind,source="${path}",target=/claude_desktop_config`,
        BUSYBOX,
        "/bin/cat",
        "/claude_desktop_config/claude_desktop_config.json",
      ]);
      if (result.stdout) {
        payload = JSON.parse(result.stdout);
      }
    } catch (e) {
      // No config or malformed config found, overwrite it
    }

    if (!payload.mcpServers) {
      payload.mcpServers = {};
    }
    payload.mcpServers.MCP_DOCKER = SAMPLE_MCP_CONFIG.mcpServers.MCP_DOCKER;

    try {
      await writeToMount(
        client,
        `type=bind,source="${path}",target=/claude_desktop_config`,
        "/claude_desktop_config/claude_desktop_config.json",
        JSON.stringify(payload, null, 2)
      );
    } catch (e) {
      client.desktopUI.toast.error((e as any).stderr);
    }
  };
  disconnect = async (client: v1.DockerDesktopClient) => {
    const platform = client.host.platform;
    let path = "";
    switch (platform) {
      case "darwin":
        path = "/Users/$USER/Library/Application Support/Claude/";
        break;
      case "linux":
        path = "/home/$USER/.config/claude/";
        break;
      case "win32":
        path = "%APPDATA%\\Claude\\";
        break;
      default:
        throw new Error("Unsupported platform: " + platform);
    }
    const user = await getUser(client);
    path = path.replace("$USER", user);
    try {
      // This method is only called after the config has been validated, so we can safely assume it's a valid config.
      const previousConfig = JSON.parse(
        (
          await client.docker.cli.exec("run", [
            "--rm",
            "--mount",
            `type=bind,source="${path}",target=/claude_desktop_config`,
            "-w",
            "/claude_desktop_config",
            BUSYBOX,
            "/bin/cat",
            "/claude_desktop_config/claude_desktop_config.json",
          ])
        ).stdout || "{}"
      );
      const newConfig = { ...previousConfig };
      delete newConfig.mcpServers.MCP_DOCKER;
      await writeToMount(
        client,
        `type=bind,source="${path}",target=/claude_desktop_config`,
        "/claude_desktop_config/claude_desktop_config.json",
        JSON.stringify(newConfig, null, 2)
      );
    } catch (e) {
      client.desktopUI.toast.error((e as any).stderr);
    }
  };
  validateConfig = (content: string) => {
    const config = JSON.parse(content || "{}");
    return !!config.mcpServers?.MCP_DOCKER;
  };
}

export default new ClaudeDesktopClient();
