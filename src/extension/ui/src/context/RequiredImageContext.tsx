import React, { createContext, useContext, ReactNode } from 'react';
import { v1 } from "@docker/extension-api-client-types";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExecResult } from '@docker/extension-api-client-types/dist/v0';

// List of required images for the extension
const REQUIRED_IMAGES = [
    'vonwig/function_write_files:latest',
    'alpine:latest'
];

// Image loading state interface
interface ImageState {
    status: 'idle' | 'loading' | 'success' | 'error';
    result?: ExecResult;
    error?: unknown;
}

interface RequiredImagesContextType {
    // State mapping image names to their loading state
    imageStates: Record<string, ImageState>;
    // Overall loading state
    isLoading: boolean;
    isFetching: boolean;
    // Actions
    loadAllImages: () => Promise<void>;
    loadImage: (imageName: string) => Promise<void>;
}

const RequiredImagesContext = createContext<RequiredImagesContextType | undefined>(undefined);

export function useRequiredImagesContext() {
    const context = useContext(RequiredImagesContext);
    if (context === undefined) {
        throw new Error('useRequiredImagesContext must be used within a RequiredImagesProvider');
    }
    return context;
}

interface RequiredImagesProviderProps {
    children: ReactNode;
    client: v1.DockerDesktopClient;
}

export function RequiredImagesProvider({ children, client }: RequiredImagesProviderProps) {

    // Create queries for each required image
    const imageQueries = REQUIRED_IMAGES.map(imageName => {
        return useQuery({
            queryKey: ['image', imageName],
            queryFn: async () => {
                try {
                    return await client.docker.cli.exec('pull', [imageName]);
                } catch (error) {
                    client.desktopUI.toast.error(`Failed to pull image ${imageName}: ${error}`);
                    throw error;
                }
            },
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        });
    });

    // Construct the image states map
    const imageStates: Record<string, ImageState> = {};

    REQUIRED_IMAGES.forEach((imageName, index) => {
        const query = imageQueries[index];
        imageStates[imageName] = {
            status: query.isLoading ? 'loading' :
                query.isError ? 'error' :
                    query.isSuccess ? 'success' : 'idle',
            result: query.data,
            error: query.error
        };
    });

    // Calculate overall loading state
    const isLoading = imageQueries.some(query => query.isLoading);
    const isFetching = imageQueries.some(query => query.isFetching);

    // Load a specific image
    const loadImage = async (imageName: string) => {
        const index = REQUIRED_IMAGES.indexOf(imageName);
        if (index === -1) {
            client.desktopUI.toast.error(`Unknown image: ${imageName}`);
            return;
        }

        try {
            await imageQueries[index].refetch();
        } catch (error) {
            client.desktopUI.toast.error(`Failed to load image ${imageName}: ${error}`);
        }
    };

    // Load all required images
    const loadAllImages = async () => {
        try {
            await Promise.all(imageQueries.map(query => query.refetch()));
        } catch (error) {
            client.desktopUI.toast.error(`Failed to load one or more images: ${error}`);
        }
    };

    const value = {
        imageStates,
        isLoading,
        isFetching,
        loadAllImages,
        loadImage
    };

    return <RequiredImagesContext.Provider value={value}>{children}</RequiredImagesContext.Provider>;
}
