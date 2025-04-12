---
mcp:
  - container:
      image: mcp/obsidian:latest
      secrets:
        obsidian.api_key: OBSIDIAN_API_KEY
  - source:
      url: https://github.com/slimslenderslacks/mcp-obsidian/tree/slim/docker
---

# Configuration

See the [setup instructions](https://github.com/slimslenderslacks/mcp-obsidian/tree/slim/docker?tab=readme-ov-file#quickstart) for how to
add the REST API plugin to your local Obsidian instance.
