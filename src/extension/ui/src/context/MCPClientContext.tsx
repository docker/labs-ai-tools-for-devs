import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v1 } from "@docker/extension-api-client-types";
import { getMCPClientStates, MCPClientState } from '../MCPClients';
import { POLL_INTERVAL } from '../Constants';

interface MCPClientContextType {
    // State
    mcpClientStates: { [name: string]: MCPClientState };
    buttonsLoading: { [name: string]: boolean };

    // Actions
    updateMCPClientStates: () => Promise<void>;
    setButtonsLoading: (buttonsLoading: { [name: string]: boolean }) => void;
}

const MCPClientContext = createContext<MCPClientContextType | undefined>(undefined);

export function useMCPClientContext() {
    const context = useContext(MCPClientContext);
    if (context === undefined) {
        throw new Error('useMCPClientContext must be used within a MCPClientProvider');
    }
    return context;
}

interface MCPClientProviderProps {
    children: ReactNode;
    client: v1.DockerDesktopClient;
}

export function MCPClientProvider({ children, client }: MCPClientProviderProps) {
    // State
    const [mcpClientStates, setMcpClientStates] = useState<{ [name: string]: MCPClientState }>({});
    const [buttonsLoading, setButtonsLoading] = useState<{ [name: string]: boolean }>({});

    // Update MCP client states
    const updateMCPClientStates = async () => {
        const oldStates = mcpClientStates;
        const states = await getMCPClientStates(client)
        setMcpClientStates(states);
        // Whenever a client connection changes, show toast to user
        if (Object.values(oldStates).some(state => state.exists && !state.configured && states[state.client.name].configured)) {
            client.desktopUI.toast.success('MCP Client Connected. Restart it to load the Catalog.');
        }
        if (Object.values(oldStates).some(state => state.exists && state.configured && !states[state.client.name].configured)) {
            client.desktopUI.toast.error('MCP Client Disconnected. Restart it to remove the Catalog.');
        }
    }

    // Initialize everything
    useEffect(() => {
        let interval: NodeJS.Timeout;
        updateMCPClientStates();
        interval = setInterval(() => {
            updateMCPClientStates();
        }, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    const value = {
        mcpClientStates,
        buttonsLoading,
        updateMCPClientStates,
        setButtonsLoading
    };

    return <MCPClientContext.Provider value={value}>{children}</MCPClientContext.Provider>;
} 