# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM node:23-alpine3.21@sha256:86703151a18fcd06258e013073508c4afea8e19cd7ed451554221dd00aea83fc AS client-builder
WORKDIR /ui
COPY ui/package.json ui/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY ui/. .
RUN --mount=type=cache,target=/root/.npm npm run build

FROM alpine:3.21@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c
ARG TARGETARCH
LABEL org.opencontainers.image.title="Docker MCP Toolkit" \
    org.opencontainers.image.description="Docker MCP Toolkit is a Docker Desktop Extension allowing to connect dockerized MCP servers to MCP clients" \
    org.opencontainers.image.vendor="Docker Inc" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots='[{"alt":"screenshot of the extension UI", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot1.png"}, {"alt":"Screenshot of Tile configuration", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot2.png"}, {"alt":"Screenshot of MCP Client configuration", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot3.png"}]' \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/main/src/extension/ui/src/assets/extension-icon.png" \
    com.docker.extension.detailed-description="Browse and connect Dockerized MCP servers to your favorite MCP clients" \
    com.docker.extension.publisher-url="https://www.docker.com/" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="Added MCP catalog"

COPY docker-compose.yaml metadata.json extension-icon.svg /
COPY ui/static-assets ui/static-assets
COPY host-binary/dist/windows-${TARGETARCH}/host-binary.exe /windows/host-binary.exe
COPY host-binary/dist/darwin-${TARGETARCH}/host-binary /darwin/host-binary
COPY host-binary/dist/linux-${TARGETARCH}/host-binary /linux/host-binary
COPY --from=client-builder /ui/build ui
