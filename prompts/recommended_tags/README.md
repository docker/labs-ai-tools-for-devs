---
extractors:
tool_choice: auto
model: gpt-4
stream: true
functions:
  - name: docker_scout_tag_recommendation
---

# Background

```sh
# docker:command=recommended-tags
bb -m prompts run \
              --host-dir /Users/slim/docker/labs-make-runbook \
              --user jimclark106 \
              --platform darwin \
              --prompts-dir prompts/recommended_tags \
              --url http://localhost:11434/v1/chat/completions \
              --model "mistral-nemo" \
              --nostream \
```


## functions

These instructions in these prompts rely on 3 functions

3. `docker_scout_tag_recommendation` - uses Docker Scout to improve the choice tag selection during code generation.
