---
mcp:
  - container:
      image: mcp/atlassian:latest
      workdir: /app
      secrets:
        atlassian.confluence.api_token: CONFLUENCE_API_TOKEN
        atlassian.confluence.personal_token: CONFLUENCE_PERSONAL_TOKEN
        atlassian.jira.api_token: JIRA_API_TOKEN
        atlassian.jira.personal_token: JIRA_PERSONAL_TOKEN
      environment:
        CONFLUENCE_URL: "{{atlassian.confluence.url}}"
        CONFLUENCE_USERNAME: "{{atlassian.confluence.username}}"
        JIRA_URL: "{{atlassian.jira.url}}"
        JIRA_USERNAME: "{{atlassian.jira.username}}"
    source:
      url: https://github.com/sooperset/mcp-atlassian/tree/main
---
