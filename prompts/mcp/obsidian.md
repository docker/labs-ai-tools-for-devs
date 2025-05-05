---
mcp:
  - container:
      image: mcp/obsidian:latest
      workdir: /app
      secrets:
        obsidian.api_key: OBSIDIAN_API_KEY
      environment:
        OBSIDIAN_HOST: "host.docker.internal"
    source:
      url: https://github.com/cmrigney/mcp-obsidian/tree/docker-support
---

# Configuration

See the [setup instructions](https://github.com/slimslenderslacks/mcp-obsidian/tree/slim/docker?tab=readme-ov-file#quickstart) for how to
add the REST API plugin to your local Obsidian instance.
