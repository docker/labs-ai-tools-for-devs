/**
 * This module exports MCP (Message Control Protocol) clients for different applications.
 * Each client is exported as a singleton instance and cached by the module system.
 * Multiple imports of this module will always return the same client instances,
 * ensuring consistent state across the application.
 */

import { v1 } from "@docker/extension-api-client-types";
import Cursor from "./Cursor";
import ClaudeDesktop from "./ClaudeDesktop";
import Gordon from "./Gordon";

export type MCPClient = {
    name: string;
    url: string;
    readFile: (client: v1.DockerDesktopClient) => Promise<{ content: string | null | undefined, path: string }>;
    connect: (client: v1.DockerDesktopClient) => Promise<void>;
    disconnect: (client: v1.DockerDesktopClient) => Promise<void>;
    validateConfig: (content: string) => boolean;
    expectedConfigPath: { [key in 'win32' | 'darwin' | 'linux']: string };
    manualConfigSteps: string[];
}

export const SUPPORTED_MCP_CLIENTS: MCPClient[] = [
    Gordon,
    ClaudeDesktop,
    Cursor,
]