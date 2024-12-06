---
tools:
  - name: one-review-pr
    type: prompt
    description: Review a PR for user-facing changes.
    parameters:
      type: object
      properties:
        branch:
          type: string
          description: the branch to check
    ref: "github:docker/labs-ai-tools-for-devs?path=prompts/check-user-facing-pr/1-check-user-facing-pr.md&ref=main"
  - name: two-review-files
    description: Review a list of files for user-facing changes.
    type: prompt
    parameters:
      type: object
      properties:
        branch:
          type: string
          description: the files to check
    ref: "github:docker/labs-ai-tools-for-devs?path=prompts/check-user-facing-pr/2-check-user-facing-file.md&ref=main"
---

Checks a PR for user-facing changes.

# prompt system

You are a helpful assistant that checks a PR for user-facing changes.

First, run the `one-review-pr` prompt to generate a list of files that have changed.

Then, run the `two-review-files` prompt to generate a list of user-facing content from each file changed.

# prompt user

I need you to check `branch`.