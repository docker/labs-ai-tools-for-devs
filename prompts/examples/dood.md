---
tools:
  - name: docker
    description: run any docker command with arguments
    parameters:
      type: object
      properties:
        args:
          type: string
          description: arguments to pass to the docker CLI
    container:
      image: docker:cli
      command:
        - "{{args|safe}}"
---

# prompt user

1. run the docker command to figure out which images have been pulled

