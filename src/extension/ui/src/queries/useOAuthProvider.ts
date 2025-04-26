import { useMutation, useQuery } from "@tanstack/react-query";
import { v1 } from "@docker/extension-api-client-types";
import {
  authorizeOAuthApp,
  listOAuthApps,
  unauthorizeOAuthApp,
} from "../utils/OAuth";

const useOAuthProvider = (client: v1.DockerDesktopClient) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["oauth-providers"],
    queryFn: () => listOAuthApps(client),
  });
  const authorizeOAuthProvider = useMutation({
    mutationFn: (appId: string) => authorizeOAuthApp(client, appId),
  });
  const unauthorizeOAuthProvider = useMutation({
    mutationFn: (appId: string) => unauthorizeOAuthApp(client, appId),
  });
  return {
    data,
    isLoading,
    error,
    authorizeOAuthProvider,
    unauthorizeOAuthProvider,
  };
};

export default useOAuthProvider;
