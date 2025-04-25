import { v1 } from "@docker/extension-api-client-types";
import { useEffect, useState } from "react";
import { BUSYBOX } from "../Constants";

export function useRequiredImages(client: v1.DockerDesktopClient) {
    const [isLoading, setIsLoading] = useState(false);

    const imageName = BUSYBOX;
    const fetchRequiredImage = async () => {
        try {
            await client.docker.cli.exec('inspect', [imageName]);
        } catch (error) {
            // Ignore
        }

        try {
            await client.docker.cli.exec('pull', [imageName]);
        } catch (error) {
            client.desktopUI.toast.error(`Failed to pull image ${imageName}: ${error}`);
            throw error;
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchRequiredImage().then(() => {
            setIsLoading(false);
        });
    }, []);

    return {
        isLoading,
    };
} 