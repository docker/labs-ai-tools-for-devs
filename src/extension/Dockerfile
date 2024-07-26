FROM golang:1.21-alpine AS builder
ENV CGO_ENABLED=0
WORKDIR /backend
COPY backend/go.* .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download
COPY backend/. .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -ldflags="-s -w" -o bin/service

FROM --platform=$BUILDPLATFORM node:21.6-alpine3.18 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Labs AI Tools for Devs" \
    org.opencontainers.image.description="Agentic workflows with Dockerized tools" \
    org.opencontainers.image.vendor="Docker Inc" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots='[{"alt":"screenshot", "url":"https://foo.bar/image1.png"}]' \
    com.docker.desktop.extension.icon="./docker.svg" \
    com.docker.extension.detailed-description="A tool to quickly install/uninstall early access VSCode extensions from Docker Labs." \
    com.docker.extension.publisher-url="https://www.docker.com/" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="Initial release"

COPY --from=builder /backend/bin/service /
COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg /docker.svg
COPY --chmod=0755 binary/dist/install .
COPY --chmod=0755 binary/dist/install.exe .
COPY --from=client-builder /ui/build ui
CMD /service -socket /run/guest-services/backend.sock
