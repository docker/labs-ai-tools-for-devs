import { renderHook, waitFor } from "@testing-library/react";
import { useCatalogAll } from "../src/queries/useCatalog";
import { v1 } from "@docker/extension-api-client-types";
import { expect, jest, test } from "@jest/globals"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react';

// Create QueryClient for tests
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// Create a simple wrapper function
const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
    );
};

const dummyClient: v1.DockerDesktopClient = {
    extension: {
        image: '',
    },
    desktopUI: {
        toast: {
            success: jest.fn(),
            warning: jest.fn(),
            error: jest.fn(),
        },
        dialog: {
            showOpenDialog: jest.fn(() => Promise.resolve({
                filePaths: [],
                canceled: false,
            }))
        },
        navigate: {
            viewContainers: jest.fn(() => Promise.resolve()),
            viewContainer: jest.fn(() => Promise.resolve()),
            viewContainerLogs: jest.fn(() => Promise.resolve()),
            viewContainerInspect: jest.fn(() => Promise.resolve()),
            viewContainerStats: jest.fn(() => Promise.resolve()),
            viewContainerTerminal: jest.fn(() => Promise.resolve()),
            viewImages: jest.fn(() => Promise.resolve()),
            viewImage: jest.fn(() => Promise.resolve()),
            viewVolumes: jest.fn(() => Promise.resolve()),
            viewVolume: jest.fn(() => Promise.resolve()),
            viewDevEnvironments: jest.fn(() => Promise.resolve()),
        }


    },
    host: {
        platform: 'darwin',
        openExternal: jest.fn(() => Promise.resolve()),
        arch: 'x64',
        hostname: 'localhost',
    },
    docker: {
        cli: {
            exec: jest.fn(() => {
                const promise = Promise.resolve({
                    lines: jest.fn(() => [] as string[]),
                    parseJsonLines: jest.fn(() => [] as any[]),
                    parseJsonObject: jest.fn(() => ({}) as any),
                    stdout: '',
                    stderr: '',
                });
                // Add close method to the promise
                (promise as any).close = jest.fn(() => Promise.resolve());
                return promise as any;
            }),
        },
        listContainers: jest.fn(() => Promise.resolve()),
        listImages: jest.fn(() => Promise.resolve()),
    },
}

test('useCatalogAll hook should load data correctly', async () => {
    // make sure localStorage is defined

    const { result } = renderHook(() => useCatalogAll(dummyClient), { wrapper });

    // Wait for the loading state to be success
    await waitFor(() => {
        expect(result.current.catalogLoading).toBe(false);
        expect(result.current.registryLoading).toBe(false);
    });
});