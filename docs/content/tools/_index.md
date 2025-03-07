---
title: MCP Catalog
weight: 1
cascade:
  type: docs
---

## Background

The `mcp/docker` container is an mcp server that can be extended with new
container-based tools, and prompts. Existing containers, like `curl` or `ffmpeg`, can
now be exposed as MCP servers without having to wrap each tool in an mcp server.

```mermaid
flowchart LR
    desktop["MCP Client"]
    subgraph docker["Docker Desktop"]
        mcp["mcp/docker"]
    end
    desktop --> docker
    docker -- extended by --- box1["Tool Containers"]
    docker -- extended by --- box2["MCP Server Containers"]
    style desktop fill:#f9f9f9,stroke:#333,stroke-width:2px
    style docker fill:#e6f3ff,stroke:#333,stroke-width:2px,color:#0066cc
    style mcp fill:#fff,stroke:#333,stroke-width:1px
    style box1 fill:#f9f9f9,stroke:#333,stroke-width:2px
    style box2 fill:#f9f9f9,stroke:#333,stroke-width:2px
```

Definitions of new tools and prompts are made using markdown documents that can either use plain Docker
image _as_ tools, or serve requests to containerized MCP servers.

```markdown
---
tools:
  - name: curl
    description: run the curl command
    container:
      image: curl:latest
mcp:
  - container: mcp/sequentialthinking
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

## Getting Started

1. [using Gordon](quickstart_gordon)
2. [using Claude Desktop](quickstart)
3. [using Cursor](quickstart_cursor)
4. [testing definitions in vscode](quickstart_vscode) using our VSCode extension. Using VSCode as an
   mcp server can provide an effective inner loop for developing the content.
