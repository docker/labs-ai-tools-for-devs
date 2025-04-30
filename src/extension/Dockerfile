## syntax=docker/dockerfile:1.4
#FROM golang:1.24-alpine AS builder
#ENV CGO_ENABLED=0
#WORKDIR /backend
#COPY backend/go.* .
#RUN --mount=type=cache,target=/go/pkg/mod \
#--mount=type=cache,target=/root/.cache/go-build \
#go mod download
#COPY backend/. .
#RUN --mount=type=cache,target=/go/pkg/mod \
#--mount=type=cache,target=/root/.cache/go-build \
#go build -trimpath -ldflags="-s -w" -o bin/service

FROM --platform=$BUILDPLATFORM node:23-alpine3.20 AS client-builder
WORKDIR /ui
COPY ui/package.json ui/package-lock.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
COPY ui/. .
RUN npm run build

FROM alpine:3.20
ARG TARGETARCH
LABEL org.opencontainers.image.title="Docker MCP Toolkit" \
    org.opencontainers.image.description="Docker MCP Toolkit is a Docker Desktop Extension allowing to connect dockerized MCP servers to MCP Clients" \
    org.opencontainers.image.vendor="Docker Inc" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots='[{"alt":"screenshot of the extension UI", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot1.png"}, {"alt":"Screenshot of Tile configuration", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot2.png"}, {"alt":"Screenshot of MCP Client configuration", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/src/extension/ui/src/assets/screenshots/screenshot3.png"}]' \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/main/src/extension/ui/src/assets/extension-icon.png" \
    com.docker.extension.detailed-description="Browse the Docker MCP Catalog and connect Dockerized MCP servers to your favorite MCP Client" \
    com.docker.extension.publisher-url="https://www.docker.com/" \
    com.docker.extension.additional-urls="https://hub.docker.com/catalogs/mcp" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="Added MCP catalog"

#COPY --from=builder /backend/bin/service /
COPY docker-compose.yaml .
COPY metadata.json .
COPY extension-icon.svg /extension-icon.svg
COPY host-binary/dist/windows-${TARGETARCH}/host-binary.exe /windows/host-binary.exe
COPY host-binary/dist/darwin-${TARGETARCH}/host-binary /darwin/host-binary
COPY host-binary/dist/linux-${TARGETARCH}/host-binary /linux/host-binary
COPY --from=client-builder /ui/build ui
#COPY data /data

#CMD ["/service", "-socket", "/run/guest-services/backend.sock"]
