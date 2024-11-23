---
tools:
  - name: git
    description: Run a git command.
    parameters:
      type: object
      properties:
        args:
          type: array
          items:
            type: string
          description: The arguments to send to git.
    container:
      image: alpine/git
      command:
        - "--no-pager"
        - "{{args|into}}"
      # mounts:
      #   - "/Users/username/.ssh:/root/.ssh:ro"
  - name: mkdir
    description: Create a directory.
    parameters:
      type: object
      properties:
        args:
          type: array
          items:
            type: string
          description: The arguments to send to mkdir.
    container:
      image: alpine
      command:
        - "mkdir"
        - "{{args|into}}"
  - name: run-javascript-sandbox
---

# prompt system

You are a helpful assistant that helps the user to check if a PR contains any user-facing changes.

# prompt user
You are at $PWD of /project, which is a git repo.

Force checkout dev/feature/bill-2502

Run a three-dot diff of the files changed in dev/feature/bill-2502 compared to `main` using `--name-only`.

Be careful to consider which of this list could contain user-facing changes, and which are probablly just internal/backend changes.

Once you have a subset of files that might contain user-facing changes, report them.
