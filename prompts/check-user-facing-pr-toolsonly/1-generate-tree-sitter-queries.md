---
tools:
  - name: generate-pattern
    description: Scans the repo and generates a regex pattern that matches user-facing files.
    type: prompt
    prompt: scan-file-patterns.md
model: gpt-4o-mini
---

Checks a file list for user-facing changes.

# prompt system

You are an expert at writing tree-sitter queries.

Use the `generate-pattern` tool to generate a regex pattern that matches user-facing files.

Generate a tree-sitter query that will match all the user-facing nodes in the repo:

## User-facing content:

Text Nodes in any JSX or TSX files.

Text Nodes in any HTML files.

# prompt user

Can you generate me some tree-sitter queries? Tell me what extensions, languages, and patterns you see.
