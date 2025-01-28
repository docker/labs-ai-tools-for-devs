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
LABEL org.opencontainers.image.title="Labs: AI Tools for Devs" \
    org.opencontainers.image.description="Agentic workflows with Dockerized tools" \
    org.opencontainers.image.vendor="Docker Inc" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.extension.screenshots='[{"alt":"screenshot of the extension UI", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/main/src/extension/Screenshot1.png"}, {"alt":"screenshot of the extension output", "url":"https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/main/src/extension/Screenshot2.png"}]' \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/main/src/extension/docker.svg" \
    com.docker.extension.detailed-description="Internal tool for research at Docker - available to the public. Run AI-powered workflows with Dockerized tools in Docker Desktop." \
    com.docker.extension.publisher-url="https://www.docker.com/" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="Initial release"

COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg /docker.svg
COPY --from=client-builder /ui/build ui

