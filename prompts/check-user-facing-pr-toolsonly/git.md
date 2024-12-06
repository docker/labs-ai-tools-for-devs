---
tools:
  - name: git
    description: Run a git command.
    parameters:
      type: object
      properties:
        args:
          type: string
          description: The arguments to send to git.
        outfile:
          type: string
          description: The path to write the output to, or /dev/null to after you get it.
    container:
      image: alpine/git
      entrypoint:
        - /bin/sh
        - -c
      command:
        - "cp -r /thread/.ssh /root/.ssh && cp -r /thread/.gitconfig /root/.gitconfig && git --no-pager {{args|safe}} | tee {{outfile|safe}}"
model: gpt-4o-mini
---

# prompt system
Use the git tool to accomplish the user's request. 

Avoid destructive operations like force operations or reset operations. If there are untracked files, you should proceed normally and don't touch them.

# prompt user

{{request}}
