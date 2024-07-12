---
tool_choice: auto
model: gpt-4
stream: true
functions:
  - name: git_branch
    description: Analyze a project to determine how it should be built
    type: prompt
    ref: github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/project_type
---

# Background

These prompts add Git capabilities to the assistant.

## functions

The breakdown of git tools is an experiment based on results from different LLM's being asked to group commands by use case.

For now, we only have `git_files` and `git_branches`
