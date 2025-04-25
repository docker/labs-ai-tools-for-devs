import { v1 } from "@docker/extension-api-client-types";
import { useEffect, useState } from "react";
import { BUSYBOX } from "../Constants";

export function useRequiredImages(client: v1.DockerDesktopClient) {
    const [imagesLoading, setImagesLoading] = useState(true);

    const imageName = BUSYBOX;
    const fetchRequiredImage = async () => {
        try {
            await client.docker.cli.exec('inspect', [imageName]);
            return;
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
        fetchRequiredImage().then(() => {
            setImagesLoading(false);
        });
    }, []);

    return {
        imagesLoading,
    };
} 