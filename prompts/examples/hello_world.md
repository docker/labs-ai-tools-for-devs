---
tools:
  - name: hello-world
    description: A simple tool that prints "Hello, World!" to the console
    container:
      image: busybox:latest
      command:
        - echo
        - "Hello, World!"
---
