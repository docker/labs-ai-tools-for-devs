---
tools:
  - name: run-javascript-sandbox
  - name: generate-queries-agent
    type: prompt
    description: Generates tree-sitter queries for the given project.
    prompt: 1-generate-tree-sitter-queries.md
  - name: git-agent
    description: Handles git operations.
    prompt: git.md
    type: prompt
    parameters:
      type: object
      properties:
        request:
          type: string
          description: The human readable text request to send to the git agent.
  - name: tree-sitter-agent
    description: Handles tree-sitter operations.
    type: prompt
    prompt: tree-sitter.md
    parameters:
      type: object
      properties:
        request:
          type: string
          description: The human readable text request to send to the tree-sitter agent.
model: gpt-4o
---

Checks a PR for user-facing changes.

# prompt system

You are a helpful assistant that checks a PR for user-facing changes.

Execute steps one at a time. Don't use more than one tool at a time. Wait for each step to complete before starting the next.

1. Fetch everything and get on latest main.
<!-- 2. Generate tree-sitter queries for the given project. -->
2. Checkout the PR branch and pull latest.
3. Run a three-dot git diff against main for just files changed. Write the output to /thread/diff.txt.
<!-- 5. Run the `run-javascript-sandbox` tool with a script which reads /thread/diff.txt and filters the extensions to only include user-facing files based on the regex pattern. The script should console.log the user-facing files and write them to /thread/user-facing-diff.txt.
6. Run the generated tree-sitter queries against the first user facing diff file and report the results. Make sure any files are prefixed with the project path `/project/`.  -->
# prompt user

I need you to check the branch `ac-4435-change-desktop-settings-reporting-to`.
