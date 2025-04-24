import { v1 } from "@docker/extension-api-client-types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import { DD_BUILD_WITH_SECRET_SUPPORT } from "../Constants";

const parseDDVersion = (ddVersion: string) => {
  //eg: Docker Desktop 4.40.0 (184396)
  const [, , version, build] = ddVersion.split(" ");
  return {
    version,
    build: parseInt(build.replace("(", "").replace(")", "")),
  };
};

const useDDInfo = (client: v1.DockerDesktopClient) => {
  const { data: ddInfo, isLoading: ddInfoLoading } = useQuery({
    queryKey: ["ddInfo"],
    queryFn: async () => {
      const result = await client.docker.cli.exec("version", [
        "--format",
        "json",
      ]);

      const baseVersion = JSON.parse(result.stdout);
      const parsedVersion = parseDDVersion(baseVersion.Server.Platform.Name);
      const hasSecretSupport =
        parsedVersion.build >= DD_BUILD_WITH_SECRET_SUPPORT;

      return {
        ...baseVersion,
        parsedVersion,
        hasSecretSupport,
        version: baseVersion.Server.Version,
      };
    },
  });

  return { ddInfo, ddInfoLoading };
};

export default useDDInfo;
