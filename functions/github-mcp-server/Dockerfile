FROM alpine:3.21
RUN apk add --no-cache ca-certificates

WORKDIR /server
COPY --from=ghcr.io/github/github-mcp-server  /server/github-mcp-server .
ENTRYPOINT ["/server/github-mcp-server", "stdio"]
