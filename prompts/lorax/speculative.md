---
model: claude-3-5-sonnet-20241022
tools:
  - name: sandbox-source
    description: make a cloned host repo available to the sandbox
    parameters:
      type: object
      properties:
        host-dir:
          type: string
    container:
      image: vonwig/speculative:latest
      mounts:
        - "{{host-dir|safe}}:/repo"
      commands:
        - sandbox
        - source
        - /repo
  - name: sandbox-clone
    description: create a sandbox for a host repo and respond with the id of the new sandbox
    parameters:
      type: object
      properties:
        sandbox-name:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - clone
        - "user-source"
        - "--name"
        - "{{sandbox-name}}"
  - name: sandbox-snapshot
    description: snapshot the current state of a sandbox
    parameters:
      type: object
      properties:
        sandbox-id:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - snapshot
        - "{{sandbox-id}}"
  - name: sandbox-restore
    description: snapshot the current state of a sandbox
    parameters:
      type: object
      properties:
        sandbox-id:
          type: string
        tree-id:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - restore
        - "{{sandbox-id}}"
        - "{{tree-id}}"
  - name: sandbox-exec
    description: exec a container in the current sandbox
    parameters:
      type: object
      properties:
        sandbox-id:
          type: string
        image:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - exec
        - --mount-image
        - "{{image}}"
        - "{{sandbox-id}}"
  - name: sandbox-delete-file
    description: exec a container in the current sandbox
    parameters:
      type: object
      properties:
        sandbox-id:
          type: string
        path:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - delete
        - "{{sandbox-id}}"
        - "{{path}}"
  - name: sandbox-rm
    description: exec a container in the current sandbox
    parameters:
      type: object
      properties:
        sandbox-id:
          type: string
        path:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - rm 
        - "{{sandbox-id}}"
  - name: sandbox-diff
    description: exec a container in the current sandbox
    parameters:
      type: object
      properties:
        sandbox-id:
          type: string
        tree-id:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - diff
        - "{{sandbox-id}}"
        - "{{tree-id}}"
  - name: sandbox-apply
    description: exec a container in the current sandbox
    parameters:
      type: object
      properties:
        diff:
          type: string
    container:
      image: vonwig/speculative:latest
      commands:
        - sandbox
        - apply
        - user-source
        - "{{diff}}"
---

# prompt

* create a sandbox for the host repo at '/Users/slim/vonwig/altaservice' and name it atlas
* execute 
