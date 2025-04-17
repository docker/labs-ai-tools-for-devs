---
mcp:
  - container:
      image: mcp/atlassian:latest
      workdir: /app
      secrets:
        atlassian.jira.token: JIRA_API_TOKEN
        atlassian.confluence.token: CONFLUENCE_API_TOKEN
      environment:
        CONFLUENCE_URL: "{{atlassian.confluence.url}}"
        CONFLUENCE_USERNAME: "{{atlassian.confluence.username}}"
        JIRA_URL: "{{atlassian.jira.url}}"
        JIRA_USERNAME: "{{atlassian.jira.username}}"
    source:
      url: https://github.com/sooperset/mcp-atlassian/tree/main
---
