FROM ghcr.io/github/github-mcp-server as github

FROM debian:bookworm-slim

WORKDIR /server

COPY --from=github /server/github-mcp-server .

ENTRYPOINT ["/server/github-mcp-server", "stdio"]

