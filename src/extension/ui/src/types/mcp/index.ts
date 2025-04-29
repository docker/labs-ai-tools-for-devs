import { v1 } from "@docker/extension-api-client-types";

export interface MCPClient {
    name: string;
    url: string;
    connect: (client: v1.DockerDesktopClient) => Promise<void>; // Connects catalog to the MCP client
    disconnect: (client: v1.DockerDesktopClient) => Promise<void>; // Disconnects catalog from the MCP client
    expectedConfigPath?: { [key in 'win32' | 'darwin' | 'linux']: string }; // Path to the config file, if applicable
    manualConfigSteps: string[];
};

export type MCPClientState = {
    name: string;
    connected: boolean;
    path?: string;
}; 