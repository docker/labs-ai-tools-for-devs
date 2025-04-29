import { v1 } from "@docker/extension-api-client-types";
import { stringify } from "yaml";
import { MCPClient, SAMPLE_MCP_CONFIG } from "./MCPTypes";

class ContinueDotDev implements MCPClient {
  name = "Continue.dev";
  url = "https://continue.dev/";
  manualConfigSteps = [
    "Open <strong>Continue.dev Settings </strong>",
    "in your global .continue folder (~/.continue on Mac, %USERPROFILE%.continue) within .continue/assistants. The name of the file will be used as the display name of the assistant, e.g. My Assistant.yaml",
    "Add block mcpServers:",
    stringify(SAMPLE_MCP_CONFIG),
  ];
  expectedConfigPath = {
    darwin: "$HOME/.continue/config.yaml",
    linux: "$HOME/.continue/config.yaml",
    win32: "$USERPROFILE\\.continue\\config.yaml",
  };
  connect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "connect", "--global", "continue"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to connect Continue.dev");
    }
  };
  disconnect = async (client: v1.DockerDesktopClient) => {
    try {
      await client.extension.host?.cli.exec("host-binary", ["client", "disconnect", "--global", "continue"]);
    } catch (e) {
      client.desktopUI.toast.error("Unable to disconnect Continue.dev");
    }
  };
}

export default new ContinueDotDev();
