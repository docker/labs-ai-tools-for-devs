export const POLL_INTERVAL = 1000 * 30;
export const MCP_POLICY_NAME = 'MCP=*';
export const DD_BUILD_WITH_SECRET_SUPPORT = 184396;
export const CATALOG_URL = 'https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/catalog.yaml'

export const getUnsupportedSecretMessage = (ddVersion: { version: string, build: number }) => {
    return `Secret support is not available in this version of Docker Desktop. You are on version ${ddVersion.version}, but the minimum required version is 4.40.0.`
}

export const DOCKER_MCP_COMMAND = 'docker run -i --rm alpine/socat STDIO TCP:host.docker.internal:8811'