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
    name: string; // The name of the client to display in the UI
    url: string; // URL to the client's website to download the client
    readFile: (client: v1.DockerDesktopClient) => Promise<{ content: string | null | undefined, path: string }>; // Read the client's config file
    connect: (client: v1.DockerDesktopClient) => Promise<void>; // Write or update the client's config file to connect to Docker MCP
    disconnect: (client: v1.DockerDesktopClient) => Promise<void>; // Remove Docker MCP from the client's config file
    validateConfig: (content: string) => boolean; // Validate the client's config file has the correct format and has the correct Docker MCP server
    expectedConfigPath: { [key in 'win32' | 'darwin' | 'linux']: string }; // The default path to the client's config file for each platform
    manualConfigSteps: string[]; // Array of HTML strings to display as steps to manually configure the client's config file
}

export const SUPPORTED_MCP_CLIENTS: MCPClient[] = [
    Gordon,
    ClaudeDesktop,
    Cursor,
]