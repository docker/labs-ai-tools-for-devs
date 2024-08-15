---
extractors:
tool_choice: auto
model: llama3.1
url: http://localhost:11434/v1/chat/completions
stream: false
functions:
  - name: docker_scout_tag_recommendation
---

# How to Run

```sh
# docker:command=recommended-tags
bb -m prompts run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/recommended_tags \
              --nostream
```

```clj
(core.println "hey")
```
