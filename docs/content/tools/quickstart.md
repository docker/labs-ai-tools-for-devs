---
title: Quick Start w/ Claude Desktop
weight: 1
---

{{% steps %}}

### Install

## Quick Start w/ Docker Desktop Extension

1. Install [Docker Labs AI Tools for Devs](https://open.docker.com/extensions/marketplace?extensionId=docker/labs-ai-tools-for-devs)
2. Click on the Claude button to add `mcp_docker` toolbox to your Claude Desktop.
3. Select any prompts you would like to add from the catalog to your toolbox.

or manually [configure claude desktop](../docs/claude-desktop) to use the `mcp/run` Docker container.

### Restart Claude Desktop

Restarting desktop should be a one-time activity. However, Claude
Desktop does not support the `tools/list_changed` notification so we
currently have to restart desktop more less continuously. Use `alt + r` to restart Claude Desktop.

### Try a prompt

Type an instruction to Claude that will use one of the tools you've added.
For example, if you've enabled the _hello world_ tool, then you could type the following.

> Use hello world to send a greeting and then respond to what comes back.

{{% /steps %}}
