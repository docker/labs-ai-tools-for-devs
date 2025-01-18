---
title: Quick Start w/ Claude Desktop
weight: 1
---

{{% steps %}}

### Install

[Configure Docker Desktop](../docs/claude-desktop) to use the `mcp/run` Docker container.

### Restart Claude Desktop

Restarting desktop should be a one-time activity. However, Claude
Desktop does not support the `tools/list_changed` notification so we
currently have to restart desktop more less continuously. :)

### Try a prompt

Write a prompt in Claude that will run one of the tools in a registered defintion.
For example:

> Use hello world to send a greeting and then respond to what comes back.

{{% /steps %}}
