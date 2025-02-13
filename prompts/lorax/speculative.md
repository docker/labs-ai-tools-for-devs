---
defs:
  - lorax: &lorax
      image: lorax:latest
      entrypoint: lorax
model: claude-3-5-sonnet-20241022
tools:
  - name: sandbox-source
    description: make a cloned host repo available to the sandbox
    parameters:
      type: object
      properties:
        host-dir:
          type: string
        name:
          type: string
    container: 
      <<: [*lorax]
      command:
        - sandbox
        - source
        - "-n"
        - "{{name}}"
        - "{{host-dir}}"
      background: true
  - name: sandbox-clone
    description: create a sandbox and respond with the id of the new sandbox
    parameters:
      type: object
      properties:
        sandbox-name:
          type: string
    container:
      <<: [*lorax]
      command:
        - sandbox
        - clone
        - "{{sandbox-name}}"
  - name: sandbox-snapshot
    description: snapshot the current state of a sandbox
    parameters:
      type: object
      properties:
        sandbox-id:
          type: string
    container:
      <<: [*lorax]
      command:
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
      <<: [*lorax]
      command:
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
      <<: [*lorax]
      command:
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
      <<: [*lorax]
      command:
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
      <<: [*lorax]
      command:
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
      <<: [*lorax]
      command:
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
      <<: [*lorax]
      command:
        - sandbox
        - apply
        - user-source
        - "{{diff}}"
---

# xprompt

Make a cloned repo available to the sandbox.  The host repo is '/Users/slim/vonwig/altaservice' and it should be named atlas

# prompt test lorax

Clone the sandbox named atlas. We will get back the id of the new sandbox and we should remember that.
