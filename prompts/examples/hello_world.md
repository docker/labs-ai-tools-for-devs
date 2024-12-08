---
tools:
  - name: hello-world
    description: print a secret message
    container:
      image: busybox:latest
      command:
        - echo
        - "Hello, World!"
---

# prompt user

Use hello world to print a secret message and then explain it to me

