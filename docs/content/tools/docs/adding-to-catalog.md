---
title: Adding to Catalog
---

Once you have published a prompt to a publicly accessible git repository, you can submit a PR to add it to the catalog.

[catalog.yaml](https://github.com/docker/labs-ai-tools-for-devs/blob/main/prompts/catalog.yaml)

```yaml
<prompt-name>:
  description: <prompt-description>
  icon: <prompt-icon> # Required URL to icon
  ref: <prompt-ref> # Required ref to prompt. Format: <provider>:<repo>?ref=<ref>&path=<path> example: github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/examples/mcp-sqlite.md
```

* choose a unique `<prompt-name>`
* the `<prompt-ref>` must be a valid github reference uri, which is of the form `github:<org-name>/<repo-name>?path=relative/path/to/file.md` (you can refer to a branch 
  by adding another query parameter `&ref=<branch-name>`)
