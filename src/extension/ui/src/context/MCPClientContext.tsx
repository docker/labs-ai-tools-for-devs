import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v1 } from "@docker/extension-api-client-types";
import { getMCPClientStates, MCPClientState } from '../MCPClients';
import { POLL_INTERVAL } from '../Constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MCPClientContextType {
    // State
    mcpClientStates: { [name: string]: MCPClientState } | undefined;
    buttonsLoading: { [name: string]: boolean };
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;

    // Actions
    updateMCPClientStates: () => Promise<void>;
    setButtonsLoading: (buttonsLoading: { [name: string]: boolean }) => void;
    disconnectClient: (clientName: string) => Promise<void>;
    connectClient: (clientName: string) => Promise<void>;
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
    const [buttonsLoading, setButtonsLoading] = useState<{ [name: string]: boolean }>({});
    const queryClient = useQueryClient();

    // Fetch MCP client states with React Query
    const {
        data: mcpClientStates,
        isLoading,
        isError,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['mcpClientStates'],
        queryFn: async () => {
            const states = await getMCPClientStates(client);

            if (mcpClientStates) {
                const oldStates = { ...mcpClientStates };

                // Whenever a client connection changes, show toast to user
                const newlyConnectedClient = Object.values(states).find(state =>
                    state.exists && state.configured && oldStates[state.client.name] && !oldStates[state.client.name].configured
                );
                const newlyDisconnectedClient = Object.values(states).find(state =>
                    state.exists && !state.configured && oldStates[state.client.name] && oldStates[state.client.name].configured
                );

                if (newlyConnectedClient) {
                    if (newlyConnectedClient.client.name === 'Gordon') {
                        client.desktopUI.toast.success('Gordon is connected to the Catalog.');
                    } else {
                        client.desktopUI.toast.success('Client Connected: ' + newlyConnectedClient.client.name + '. Restart it to load the Catalog.');
                    }
                }
                if (newlyDisconnectedClient) {
                    if (newlyDisconnectedClient.client.name === 'Gordon') {
                        client.desktopUI.toast.error('Gordon is disconnected from the Catalog.');
                    } else {
                        client.desktopUI.toast.error('Client Disconnected: ' + newlyDisconnectedClient.client.name + '. Restart it to remove the Catalog.');
                    }
                }
            }

            return states;
        },
        refetchInterval: POLL_INTERVAL,
        initialData: undefined,
        // Add eager loading settings
        staleTime: 30000, // Data remains fresh for 30 seconds
        gcTime: 300000 // Cache data for 5 minutes even if unused
    });

    // Update MCP client states
    const updateMCPClientStates = async () => {
        await refetch();
    }

    // Disconnect client mutation
    const disconnectMutation = useMutation({
        mutationFn: async (clientName: string) => {
            const clientState = mcpClientStates?.[clientName];
            if (!clientState) throw new Error(`Client ${clientName} not found`);

            // Perform the actual disconnect
            await clientState.client.disconnect(client);
        },
        onMutate: async (clientName) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['mcpClientStates'] });

            // Snapshot the previous value
            const previousStates = queryClient.getQueryData(['mcpClientStates']);

            // Optimistically update to the new value
            if (mcpClientStates) {
                const updatedStates = {
                    ...mcpClientStates,
                    [clientName]: {
                        ...mcpClientStates[clientName],
                        configured: false
                    }
                };

                queryClient.setQueryData(['mcpClientStates'], updatedStates);
            }

            return { previousStates };
        },
        onSettled: () => {
            // Refetch after disconnect to ensure we have the latest state
            queryClient.invalidateQueries({ queryKey: ['mcpClientStates'] });
        }
    });

    // Connect client mutation
    const connectMutation = useMutation({
        mutationFn: async (clientName: string) => {
            const clientState = mcpClientStates?.[clientName];
            if (!clientState) throw new Error(`Client ${clientName} not found`);

            // Perform the actual connect
            await clientState.client.connect(client);
        },
        onMutate: async (clientName) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['mcpClientStates'] });

            // Snapshot the previous value
            const previousStates = queryClient.getQueryData(['mcpClientStates']);

            // Optimistically update to the new value
            if (mcpClientStates) {
                const updatedStates = {
                    ...mcpClientStates,
                    [clientName]: {
                        ...mcpClientStates[clientName],
                        configured: true,
                        exists: true
                    }
                };

                queryClient.setQueryData(['mcpClientStates'], updatedStates);
            }

            return { previousStates };
        },
        onSettled: () => {
            // Refetch after connect to ensure we have the latest state
            queryClient.invalidateQueries({ queryKey: ['mcpClientStates'] });
        }
    });

    // Expose mutation methods
    const disconnectClient = async (clientName: string) => {
        await disconnectMutation.mutateAsync(clientName);
    };

    const connectClient = async (clientName: string) => {
        await connectMutation.mutateAsync(clientName);
    };

    const value = {
        mcpClientStates,
        buttonsLoading,
        isLoading,
        isError,
        isFetching,
        updateMCPClientStates,
        setButtonsLoading,
        disconnectClient,
        connectClient
    };

    return <MCPClientContext.Provider value={value}>{children}</MCPClientContext.Provider>;
} 