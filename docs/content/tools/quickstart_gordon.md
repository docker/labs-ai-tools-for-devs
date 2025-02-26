---
title: QuickStart w/ Gordon
weight: 4
---

{{% steps %}}

### Install Docker Desktop Extension

1. Install [Docker Labs AI Tools for Devs](https://open.docker.com/extensions/marketplace?extensionId=docker/labs-ai-tools-for-devs)
2. Click on the Claude button to add `mcp_docker` toolbox to your Claude Desktop.
3. Select any prompts you would like to add from the catalog to your toolbox.

### Add gordon-mcp.yaml

When you run `docker ai` from any directory, docker ai will search that directory for a gordon-mcp.yml file.
If that file is present, and configured with the `mcp/docker` container then Gordon will load tools from
this container and try to use them.

```yaml
services:
  mcp_docker:
    image: alpine:socat:latest
    command: 
      - STDIO
      - TCP:host.docker.internal:8811
    x-mcp-autoremove: true
```

{{< callout type="info" >}}

`mcp/docker` uses the local docker engine to run containers. 

{{< /callout >}}

### debugging

We suggest using `docker ai --debug` if you are trying to debug some of your tools while using the `docker ai` cli.

{{% /steps %}}
