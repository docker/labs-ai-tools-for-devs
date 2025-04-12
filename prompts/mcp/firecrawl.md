---
mcp:
  - container:
      image: mcp/firecrawl:latest
      secrets:
        firecrawl.api_key: FIRECRAWL_API_KEY
      environment:
        FIRECRAWL_API_URL: "{{firecrawl.url|safe}}"
        FIRECRAWL_RETRY_MAX_ATTEMPTS: "{{firecrawl.retry_max}}"
        FIRECRAWL_RETRY_INITIAL_DELAY: "{{firecrawl.retry_delay}}"
        FIRECRAWL_RETRY_MAX_DELAY: "{{firecrawl.retry_max_delay}}"
        FIRECRAWL_RETRY_BACKOFF_FACTOR: "{{firecrawl.retry_backoff_factor}}"
        FIRECRAWL_CREDIT_WARNING_THRESHOLD: "{{firecrawl.credit_warning_threshold}}"
        FIRECRAWL_CREDIT_CRITICAL_THRESHOLD: "{{firecrawl.credit_critical_threshold}}"
  - source:
      url: https://github.com/mendableai/firecrawl-mcp-server/tree/main
---
