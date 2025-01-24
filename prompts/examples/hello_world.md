---
name: hello from Docker
description: send a greeting from Docker
model: claude-3-5-sonnet-20241022
tools:
  - name: hello-docker
    description: print a secret message
    parameters:
      type: object
      properties:
        greeting:
          type: string
          description: the greeting to send
    container:
      image: busybox:latest
      command:
        - echo
        - "{{greeting|safe}}"
---

# prompt user

Ask the user what kind of a greeting they'd like to receive.
Once you have the answer, generate a greeting and send it to Docker.
