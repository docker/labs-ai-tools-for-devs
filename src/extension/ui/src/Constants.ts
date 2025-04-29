export const POLL_INTERVAL = 1000 * 30;
export const MCP_POLICY_NAME = "MCP=*";
export const DD_BUILD_WITH_SECRET_SUPPORT = 184396;
export const CATALOG_URL =
  "https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml";

export const getUnsupportedSecretMessage = (ddVersion: {
  version: string;
  build: number;
}) =>
  `Secret support is not available in this version of Docker Desktop. You are on version ${ddVersion.version}, but the minimum required version is 4.40.0.`;

export const DOCKER_MCP_IMAGE = "alpine/socat";
export const DOCKER_MCP_CONTAINER_ARGS = "STDIO TCP:host.docker.internal:8811";
export const DOCKER_MCP_COMMAND = `docker run -i --rm ${DOCKER_MCP_IMAGE} ${DOCKER_MCP_CONTAINER_ARGS}`;

export const CATALOG_LAYOUT_SX = {
  width: "90vw",
  maxWidth: "1200px",
};

export const ASSIGNED_SECRET_PLACEHOLDER = "********";

export const BUSYBOX = 'busybox@sha256:37f7b378a29ceb4c551b1b5582e27747b855bbfaa73fa11914fe0df028dc581f';

// Filenames in docker-prompts volume
export const REGISTRY_YAML = 'registry.yaml'
export const CONFIG_YAML = 'config.yaml'