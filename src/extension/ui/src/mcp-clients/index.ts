/**
 * This module exports MCP (Message Control Protocol) clients for different applications.
 * Each client is exported as a singleton instance and cached by the module system.
 * Multiple imports of this module will always return the same client instances,
 * ensuring consistent state across the application.
 */

import Cursor from "./Cursor";
import ClaudeDesktop from "./ClaudeDesktop";
import Gordon from "./Gordon";
import { MCPClient } from "./MCPTypes";

export const SUPPORTED_MCP_CLIENTS: MCPClient[] = [
    Gordon,
    ClaudeDesktop,
    Cursor,
]