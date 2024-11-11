---
tools:
  - name: docker
    description: run any docker command with arguments
    parameters:
      type: object
      properties:
        args:
          type: array
          items:
            type: string
          description: arguments to pass to the docker CLI
    container:
      image: docker:cli
      command:
        - "{{args|into}}"
---

# prompt user

1. use the docker command to start up a mysql server running on port 8080

