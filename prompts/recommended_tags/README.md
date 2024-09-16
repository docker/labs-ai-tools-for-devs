---
model: llama3.1
url: http://localhost:11434/v1/chat/completions
stream: false
tools:
  - image: vonwig/docker_scout_tag_recommendation:latest
---

# prompt user

Can you recommend a tag for the Docker `node` repository?
