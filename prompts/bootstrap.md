---
name: register a new skill
tools:
  - name: register-skill
    description: Register a new skill
    parameters:
      type: object
      properties:
        name:
          type: string
        ref:
          type: string
    container:
      image: alpine:latest
      volumes:
        - "docker-prompts:/prompts"
      command:
        - sh
        - "-c"
        - |
          echo "{{name}} {{ref}}" >> /prompts/skills.txt
---

# prompt

Start by asking the user for the name of the skill they want to register.
Once you have a name, ask the user for a github ref.  Complain if the github ref is not of the form `github:owner/repo?path=path/to/file.md`.  If the user provides a valid ref, register the skill using the `register-skill` tool.  Finally, ask the user if they want to register another skill.
