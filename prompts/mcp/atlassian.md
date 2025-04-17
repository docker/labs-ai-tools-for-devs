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
      secrets:
        atlassian.jira.personal_token: JIRA_PERSONAL_TOKEN
        atlassian.confluence.personal_token: CONFLUENCE_PERSONAL_TOKEN
        atlassian.jira.api_token: JIRA_API_TOKEN
        atlassian.confluence.api_token: CONFLUENCE_API_TOKEN
    source:
      url: https://github.com/sooperset/mcp-atlassian/tree/main
---
