import { v1 } from '@docker/extension-api-client-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Secrets from '../Secrets';
import { Secret } from '../types';

export function useSecrets(client: v1.DockerDesktopClient) {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      // Invalidate and refetch secrets after mutation
      queryClient.invalidateQueries({ queryKey: ['secrets'] });
    },
  });
  return { data, isLoading, error, mutate };
}
