import { v1 } from "@docker/extension-api-client-types";
import { BUSYBOX, DOCKER_MCP_COMMAND } from "../Constants";
import { getUser, writeToMount } from "../utils/Files";
import { mergeDeep } from "../MergeDeep";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";

class WindsurfDesktopClient implements MCPClient {
  name = "Windsurf";
  url = "https://windsurf.com/downloads";
  manualConfigSteps = [
    "Open <strong>Windsurf Settings</strong>",
    "Click on the <strong>MCP</strong> tab",
    "Click on the <strong>Add new MCP server</strong> button",
    "Set name: <code>MCP_DOCKER</code>",
    'Set command: <pre style="font-family: monospace; white-space: nowrap; overflow: auto; width: 80%; background-color: grey.200; padding: 1; border-radius: 1; font-size: 12px;">' +
      DOCKER_MCP_COMMAND +
      "</pre>",
  ];
  expectedConfigPath = {
    darwin: "$HOME/.codeium/mcp_config.json",
    linux: "$HOME/.codeium/mcp_config.json",
    win32: "$USERPROFILE\\.codeium\\mcp_config.json",
  };
  readConfig = async (client: v1.DockerDesktopClient) => {
    const platform = client.host
      .platform as keyof typeof this.expectedConfigPath;
    const configPath = this.expectedConfigPath[platform].replace(
      "$USER",
      await getUser(client)
    );
    try {
      const result = await client.docker.cli.exec("run", [
        "--rm",
        "--mount",
        `type=bind,source=${configPath},target=/codeium_config/mcp_config.json`,
        BUSYBOX,
        "/bin/cat",
        "/codeium_config/mcp_config.json",
      ]);
      return {
        content: result.stdout,
        path: configPath,
      };
    } catch (e) {
      return {
        content: null,
        path: configPath,
      };
    }
  };
  connect = async (client: v1.DockerDesktopClient) => {
    const config = await this.readConfig(client);
    let windsurfConfig = null;
    try {
      windsurfConfig = JSON.parse(
        config.content || "{}"
      ) as typeof SAMPLE_MCP_CONFIG;
      if (windsurfConfig.mcpServers?.MCP_DOCKER) {
        client.desktopUI.toast.warning(
          "Windsurf MCP server already connected."
        );
        return;
      }
    } catch (e) {
      windsurfConfig = mergeDeep({}, SAMPLE_MCP_CONFIG);
    }
    const payload = mergeDeep(windsurfConfig, SAMPLE_MCP_CONFIG);
    try {
      await writeToMount(
        client,
        `type=bind,source=${config.path},target=/codeium_config/mcp_config.json`,
        "/codeium_config/mcp_config.json",
        JSON.stringify(payload)
      );
    } catch (e) {
      if ((e as any).stderr) {
        client.desktopUI.toast.error((e as any).stderr);
      } else {
        client.desktopUI.toast.error((e as Error).message);
      }
    }
  };
  disconnect = async (client: v1.DockerDesktopClient) => {
    const config = await this.readConfig(client);
    if (!config.content) {
      client.desktopUI.toast.error("No config found");
      return;
    }
    let windsurfConfig = null;
    try {
      windsurfConfig = JSON.parse(config.content) as typeof SAMPLE_MCP_CONFIG;
      if (!windsurfConfig.mcpServers?.MCP_DOCKER) {
        client.desktopUI.toast.error(
          "Docker MCP Server not connected to Windsurf"
        );
        return;
      }
    } catch (e) {
      client.desktopUI.toast.error(
        "Failed to disconnect. Invalid Windsurf config found at " + config.path
      );
      return;
    }
    const payload = {
      ...windsurfConfig,
      mcpServers: Object.fromEntries(
        Object.entries(windsurfConfig.mcpServers).filter(
          ([key]) => key !== "MCP_DOCKER"
        )
      ),
    };
    try {
      await writeToMount(
        client,
        `type=bind,source=${config.path},target=/codeium_config/mcp_config.json`,
        "/codeium_config/mcp_config.json",
        JSON.stringify(payload)
      );
    } catch (e) {
      if ((e as any).stderr) {
        client.desktopUI.toast.error((e as any).stderr);
      } else {
        client.desktopUI.toast.error((e as Error).message);
      }
    }
  };
  validateConfig = (content: string) => {
    const config = JSON.parse(content || "{}") as typeof SAMPLE_MCP_CONFIG;
    return !!config.mcpServers?.MCP_DOCKER;
  };
}

export default new WindsurfDesktopClient();
