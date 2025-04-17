---
mcp:
  - container:
      image: mcp/circleci:latest
      workdir: /app
      secrets:
        circleci.token: CIRCLECI_TOKEN
      environment:
        CIRCLECI_BASE_URL: "{{circleci.url|safe}}"
    source:
      url: https://github.com/CircleCI-Public/mcp-server-circleci/tree/refs/pull/22/merge
---
