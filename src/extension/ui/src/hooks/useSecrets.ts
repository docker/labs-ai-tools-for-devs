import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../App";
import Secrets from "../Secrets";
import { v1 } from "@docker/extension-api-client-types";
import { Secret } from "../types";

export function useSecrets(client: v1.DockerDesktopClient) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['secrets'],
        queryFn: async () => {
            const secrets = await Secrets.getSecrets(client);
            return secrets;
        },
    });
    const mutate = useMutation({
        mutationFn: async (secret: Secret) => {
            if (!secret.value) {
                return Secrets.deleteSecret(client, secret.name);
            }
            return Secrets.addSecret(client, secret);
        },
    });
    return { data, isLoading, error, mutate };
}   
