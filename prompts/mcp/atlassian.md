---
mcp:
  - container:
      image: mcp/atlassian:latest
      workdir: /app
      environment:
        CONFLUENCE_URL: "{{atlassian.confluence.url}}"
        CONFLUENCE_USERNAME: "{{atlassian.confluence.username}}"
        JIRA_URL: "{{atlassian.jira.url}}"
        JIRA_USERNAME: "{{atlassian.jira.username}}"
      secrets:
        atlassian.jira.token: JIRA_PERSONAL_TOKEN
---

# Configuration

This server Atlassian Cloud products. When configuring, you must add properties for one of
either `confluence` or `jira` or both.

Entering your personal access token as a Desktop secret is required.  

**For Atlassian Cloud**

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click Create API token, name it
3. Copy the token immediately

## TODO

- [ ] Optional secrets.  We might have a jira personal token, a confluence personal token, or both.
- [ ] For mapping environment variables from the config into the container, we should skip 
      optional variables that are not in the config.
