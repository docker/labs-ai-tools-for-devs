---
title: Quick Start w/ Claude Desktop
weight: 1
---

{{% steps %}}

### Install

## Quick Start w/ Docker Desktop Extension

1. Install [Docker Labs AI Tools for Devs](https://hub.docker.com/extensions/docker/labs-ai-tools-for-devs)
2. Click on the Claude button to add `mcp_docker` toolbox to your Claude Desktop.
3. Select any prompts you would like to add from the catalog to your toolbox.

or manually [configure claude desktop](../docs/claude-desktop) to use the `mcp/run` Docker container.

### Restart Claude Desktop

Restarting desktop should be a one-time activity. However, Claude
Desktop does not support the `tools/list_changed` notification so we
currently have to restart desktop more less continuously. Fire up those keybinds :)

### Try a prompt

Write a prompt in Claude that will run one of the tools in a registered defintion.
For example:

> Use hello world to send a greeting and then respond to what comes back.

{{% /steps %}}
