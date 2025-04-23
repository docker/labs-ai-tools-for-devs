---
mcp:
  - container:
      image: mcp/perplexity-ask:latest
      workdir: /app
      secrets:
        perplexity-ask.api_key: PERPLEXITY_API_KEY
    source:
      url: https://github.com/ppl-ai/modelcontextprotocol/tree/f0a927c250e04b389ff5c34f6a2a85ad625668e8
---
