---
title: hello world
---

# Description

Just echo a greeting by running a container!

# Prompt Code

```markdown
---
name: hello-docker
description: run the hello-docker
model: claude-3-5-sonnet-20241022
tools:
  - name: hello-docker
    description: print a secret message
    container:
      image: busybox:latest
      command:
        - echo
        - "Hello, World!"
---

# prompt

Use hello world to print a secret message and then explain it to me
```

