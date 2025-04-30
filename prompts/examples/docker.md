---
tools:
  - name: docker
    description: use the docker cli
    parameters:
      type: object
      properties:
        args:
          type: array
          description: Arguments to pass to the Docker command
          items:
            type: string
    container:
      image: docker:latest
      command:
        - "{{args|into}}"
      volume:
        - "/var/run/docker.sock:/var/run/docker.sock"
---
