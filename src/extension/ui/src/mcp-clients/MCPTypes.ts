import { DOCKER_MCP_COMMAND } from "../Constants";
import { MCPClient } from "../types/mcp";

export type { MCPClient };

export const SAMPLE_MCP_CONFIG = {
    mcpServers: {
        MCP_DOCKER: {
            "command": DOCKER_MCP_COMMAND.split(' ')[0],
            "args": DOCKER_MCP_COMMAND.split(' ').slice(1),
        }
    }
}
