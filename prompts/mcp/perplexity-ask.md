---
mcp:
  - container:
      image: mcp/perplexity-ask:latest
      workdir: /app
      secrets:
        perplexity-ask.api_key: PERPLEXITY_API_KEY
  - source:
      url: https://github.com/ppl-ai/modelcontextprotocol/tree/main
---
