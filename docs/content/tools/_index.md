---
title: MCP/run Toolbox
weight: 1
cascade:
  type: docs
---

## Background

The `mcp/run` container is an mcp server, but it can be extended by giving it new
containers, as tools, and prompts. Existing containers, like `curl` or `ffmpeg`, can
then be exposed as MCP servers.

```mermaid
flowchart LR
    desktop["Claude Desktop"]
    subgraph docker["Docker"]
        mcp["mcp/run"]
    end
    desktop --> docker
    docker -- extended by --- box1["Tools/Prompt Def (curl)"]
    docker -- extended by --- box2["Tools/Prompt Def (ffmpeg)"]
    style desktop fill:#f9f9f9,stroke:#333,stroke-width:2px
    style docker fill:#e6f3ff,stroke:#333,stroke-width:2px,color:#0066cc
    style mcp fill:#fff,stroke:#333,stroke-width:1px
    style box1 fill:#f9f9f9,stroke:#333,stroke-width:2px
    style box2 fill:#f9f9f9,stroke:#333,stroke-width:2px
```

Our current definitions are markdown documents (see [examples](examples)).

```markdown
---
tools:
  - name: curl
---

# prompt

Run the curl command, in silent mode, to fetch gists for user slimslenderslacks from GitHub.
```

## Getting Started

We can use this to extend MCP clients like Claude Desktop, and create test new tools and prompts using
VSCode. Instructions for these two paths are here.

1. Attach the MCP server [to Claude Desktop](quickstart).
   {{< callout >}}
   Claude Desktop has not yet implemented the `notifications/tools/list_changed`. This means that
   Claude doesn't reload our tool definitions until it is restarted. It's easier to develop
   prompts in VSCode where we can create a much more efficient inner loop.
   {{< /callout >}}
2. [Test prompt definitions](quickstart_vscode) using our VSCode extension. Using VSCode as an
   mcp server can provide an effective inner loop for developing the content.
