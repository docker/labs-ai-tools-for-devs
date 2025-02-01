---
title: Using with Gordon
---

## gordon-mcp.yaml

When you run `docker ai` from any directory, docker ai will search that directory for a gordon-mcp.yml file.
If that file is present, and configured with the `mcp/docker` container then Gordon will load tools from
this container and try to use them.

```yaml
services:
  mcp_docker:
    image: mcp/docker:latest
    command: serve --mcp --register github:docker/labs-ai-tools-for-devs?path=prompts/bootstrap.md
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - docker-prompts:/prompts
    x-mcp-autoremove: true

volumes:
  docker-prompts:
    external: true
```

## debugging

We suggest using `docker ai --debug` if you are trying to debug some of your tools while using the `docker ai` cli.


