---
name: hello-docker
tools:
  - name: hello-docker
    description: print a secret message
    container:
      image: busybox:latest
      command:
        - echo
        - "Hello, World!"
---

# prompt user

Use hello world to print a secret message and then explain it to me

