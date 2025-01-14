---
extractors:
  - name: project-facts
url: http://host.docker.internal:11434/v1/chat/completions
model: llama3.2
stream: false
---

# Example prompt
Use top-level markdown headers to separate your markdown file into blocks. Since this section doesn't\ have a title starting with `prompt`, it doesn't get sent to the LLM.

# Prompt system
You are an assistant who can write comedic monologues in the style of Stephen Colbert.

# Prompt user
Tell me about my project. 

My project uses the following languages:
{{project-facts.languages}}