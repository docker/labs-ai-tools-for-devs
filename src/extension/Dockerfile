# syntax=docker/dockerfile:1

FROM alpine:3.21@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c AS alpine

FROM --platform=$BUILDPLATFORM golang:1.24.2-alpine3.21@sha256:7772cb5322baa875edd74705556d08f0eeca7b9c4b5367754ce3f2f00041ccee AS go-builder
WORKDIR /app
COPY host-binary ./
RUN --mount=type=cache,target=/root/.cache/go-build <<EOT
    GOOS=linux   CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /dist/linux/host-binary ./cmd
    GOOS=darwin  CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /dist/darwin/host-binary ./cmd
    GOOS=windows CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /dist/windows/host-binary.exe ./cmd
EOT

FROM --platform=$BUILDPLATFORM node:23-alpine3.21@sha256:86703151a18fcd06258e013073508c4afea8e19cd7ed451554221dd00aea83fc AS client-builder
WORKDIR /ui
COPY ui/package.json ui/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY ui/. .
RUN --mount=type=cache,target=/root/.npm npm run build

FROM --platform=$BUILDPLATFORM alpine AS pull-catalog-images
RUN apk add --no-cache curl yq
COPY --from=prompts catalog.yaml /
RUN <<EOT
    set -eo pipefail

    mkdir -p /icons
    cat /catalog.yaml | yq -r '.registry[].icon' | while read -r iconUrl; do
        name=$(echo -n "$iconUrl" | md5sum | cut -d' ' -f1)
        echo "${iconUrl} -> ${name}"
        curl -fSl "$iconUrl" -o "/icons/${name}"
    done
EOT

FROM alpine
ARG TARGETARCH
LABEL org.opencontainers.image.title="Docker MCP Toolkit" \
    org.opencontainers.image.description="Docker MCP Toolkit is a Docker Desktop Extension allowing to connect dockerized MCP servers to MCP clients" \
    org.opencontainers.image.vendor="Docker Inc" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots='[{"alt":"screenshot of the extension UI", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot1.png"}, {"alt":"Screenshot of Tile configuration", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot2.png"}, {"alt":"Screenshot of MCP Client configuration", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot3.png"}]' \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/main/src/extension/ui/src/assets/extension-icon.png" \
    com.docker.extension.detailed-description="Browse and connect Dockerized MCP servers to your favorite MCP clients" \
    com.docker.extension.publisher-url="https://www.docker.com/" \
    com.docker.extension.additional-urls="https://hub.docker.com/catalogs/mcp" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="Added MCP catalog"

COPY docker-compose.yaml metadata.json extension-icon.svg /
COPY --from=go-builder /dist/linux/host-binary /linux/host-binary
COPY --from=go-builder /dist/darwin/host-binary /darwin/host-binary
COPY --from=go-builder /dist/windows/host-binary.exe /windows/host-binary.exe
COPY --from=pull-catalog-images /icons ui/static-assets
COPY --from=client-builder /ui/build ui
