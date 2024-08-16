---
extractors:
  - name: project-facts
  - name: linguist
functions:
  - name: write_files
---

## Description

The prompts for docker rely only on the classic lsp project extraction function.

The output of running this container is a json document that will be merged into the
context that is provided to the moustache template based prompts.

