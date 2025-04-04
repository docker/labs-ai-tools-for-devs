---
name: curl
model: claude-3-5-sonnet-20241022
tools:
  - name: curl
    description: Run a curl command.
    parameters:
      type: object
      properties:
        args:
          type: string
          description: The arguments to pass to curl
    container:
      image: vonwig/curl:latest
      command:
        - "{{raw|safe}}"
    source:
      url: https://github.com/docker/labs-ai-tools-for-devs/tree/main/functions/hub/curl
arguments:
  - name: user
    description: the GitHub username to fetch gists for
    required: true
parameter-values:
  user: slimslenderslacks
---

# prompt fetch gists

## description

Use curl to fetch gists for a user (demonstrates generic usage of the curl container)

## content

Run the curl command, in silent mode, to fetch gists for user {{user}} from GitHub.

