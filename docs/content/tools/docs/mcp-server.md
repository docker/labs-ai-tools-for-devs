---
title: mcp/docker server logs
---

## Logging

When the Docker MCP server is [enabled for claude desktop](claude-desktop), the `mcp/docker` image will be running
locally. You can tail the server logs by running the following command:

```sh
docker run --rm -t --init \
           -v docker-prompts:/prompts alpine:latest \
           tail -f /prompts/log/docker-mcp-server.out
```

