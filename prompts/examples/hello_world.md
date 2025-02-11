---
name: hello Docker
description: send a greeting from Docker
model: claude-3-5-sonnet-20241022
tools:
  - name: hello-docker
    description: send a greeting from docker
    parameters:
      type: object
      properties:
        greeting:
          type: string
          description: the greeting to send
      required: [greeting]
    container:
      image: busybox:latest
      command:
        - echo
        - "{{greeting}}"
---

# prompt user

Ask what kind of a greeting I'd like to receive.
Once you have the answer, generate a greeting and send it to Docker.
