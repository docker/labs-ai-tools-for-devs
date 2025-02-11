---
title: Quick Start w/ Cursor
weight: 3
---

{{% steps %}}

### Install

## Quick Start w/ Cursor

1. Use the Features menu of the Cursor Settings
   
   ![Claude Features](claude_features.png)

2. Copy and paste the following string into the field labeled "Command".

   ```
   docker run -i --rm -v /var/run/docker.sock:/var/run/docker.sock --mount type=volume,source=docker-prompts,target=/prompts mcp/docker:latest serve --mcp --register github:docker/labs-ai-tools-for-devs?path=prompts/bootstrap.md
   ```

   After entering this command, the server will start and you should see a list of available tools.

   ![Claude Tools](claude_tools.png)


## Use tools from compose agent

Tools will only be available in the `agent` mode of the composer. Note that the composer tab has two distinct modes (`normal` and `agent`).

![compose agent](composer_agent.png)

{{% /steps %}}

