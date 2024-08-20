---
extractors:
  - name: linguist
tool_choice: auto
model: gpt-4
stream: true
functions:
  - name: analyze_project
  - name: write_files
  - name: docker_scout_tag_recommendation
---

# Background

These prompts add Dockerfile authoring skills to the assistant.

* the [user prompts](100_user_prompt.md) direct the assist to extract details about the project, and then write a Dockerfile to the root of the project.
* the [npm best practices](npm-best-practices.md) is are added to the system prompts whenever the assist detects that this is an NPM project.

