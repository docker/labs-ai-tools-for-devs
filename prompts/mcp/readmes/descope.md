# Descope MCP Server

The Descope Model Context Protocol (MCP) server provides an interface to interact with Descope's Management APIs, enabling the search and retrieval of project-related information.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/descope](https://hub.docker.com/repository/docker/mcp/descope)
**Author**|[descope-sample-apps](https://github.com/descope-sample-apps)
**Repository**|https://github.com/descope-sample-apps/descope-mcp-server
**Dockerfile**|https://github.com/descope-sample-apps/descope-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/descope)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/descope --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create-user`|Create a new user in Descope project|
`invite-user`|Create and invite a new user to the Descope project|
`search-audits`|Search Descope project audit logs|
`search-users`|Search for users in Descope project|

---
## Tools Details

#### Tool: **`create-user`**
Create a new user in Descope project
Parameters|Type|Description
-|-|-
`loginId`|`string`|Primary login identifier for the user
`additionalLoginIds`|`array` *optional*|Additional login identifiers
`customAttributes`|`object` *optional*|Custom attributes for the user
`displayName`|`string` *optional*|User's display name
`email`|`string` *optional*|User's email address
`familyName`|`string` *optional*|User's family/last name
`givenName`|`string` *optional*|User's given/first name
`middleName`|`string` *optional*|User's middle name
`phone`|`string` *optional*|User's phone number in E.164 format
`picture`|`string` *optional*|URL to user's profile picture
`roles`|`array` *optional*|Global role names to assign to the user
`ssoAppIds`|`array` *optional*|SSO application IDs to associate
`userTenants`|`array` *optional*|Tenant associations with specific roles
`verifiedEmail`|`boolean` *optional*|Whether the email is pre-verified
`verifiedPhone`|`boolean` *optional*|Whether the phone is pre-verified

---
#### Tool: **`invite-user`**
Create and invite a new user to the Descope project
Parameters|Type|Description
-|-|-
`loginId`|`string`|Primary login identifier for the user
`additionalLoginIds`|`array` *optional*|Additional login identifiers
`customAttributes`|`object` *optional*|Custom attributes for the user
`displayName`|`string` *optional*|User's display name
`email`|`string` *optional*|User's email address
`familyName`|`string` *optional*|User's family/last name
`givenName`|`string` *optional*|User's given/first name
`inviteUrl`|`string` *optional*|Custom URL for the invitation link
`middleName`|`string` *optional*|User's middle name
`phone`|`string` *optional*|User's phone number in E.164 format
`picture`|`string` *optional*|URL to user's profile picture
`roles`|`array` *optional*|Global role names to assign to the user
`sendMail`|`boolean` *optional*|Send invite via email (default follows project settings)
`sendSMS`|`boolean` *optional*|Send invite via SMS (default follows project settings)
`ssoAppIds`|`array` *optional*|SSO application IDs to associate
`templateId`|`string` *optional*|Custom template ID for the invitation
`templateOptions`|`object` *optional*|Options for customizing the invitation template
`userTenants`|`array` *optional*|Tenant associations with specific roles
`verifiedEmail`|`boolean` *optional*|Whether the email is pre-verified
`verifiedPhone`|`boolean` *optional*|Whether the phone is pre-verified

---
#### Tool: **`search-audits`**
Search Descope project audit logs
Parameters|Type|Description
-|-|-
`actions`|`array` *optional*|Filter by specific action types
`excludedActions`|`array` *optional*|Actions to exclude from results
`geos`|`array` *optional*|Filter by geographic locations
`hoursBack`|`number` *optional*|Hours to look back (max 720 hours / 30 days)
`limit`|`number` *optional*|Number of audit logs to fetch (max 10)
`loginIds`|`array` *optional*|Filter by specific login IDs
`methods`|`array` *optional*|Filter by authentication methods
`noTenants`|`boolean` *optional*|If true, only show events without tenants
`tenants`|`array` *optional*|Filter by specific tenant IDs

---
#### Tool: **`search-users`**
Search for users in Descope project
Parameters|Type|Description
-|-|-
`emails`|`array` *optional*|Filter by specific email addresses
`limit`|`number` *optional*|Number of users per page (max 100)
`loginIds`|`array` *optional*|Filter by specific login IDs
`page`|`number` *optional*|Page number for pagination
`phones`|`array` *optional*|Filter by specific phone numbers
`roles`|`array` *optional*|Filter users by role names
`ssoAppIds`|`array` *optional*|Filter users by SSO application IDs
`statuses`|`array` *optional*|Filter by user statuses ('enabled', 'disabled', or 'invited')
`tenantIds`|`array` *optional*|Filter users by specific tenant IDs
`testUsersOnly`|`boolean` *optional*|Return only test users
`text`|`string` *optional*|Text to search for in user fields
`withTestUser`|`boolean` *optional*|Include test users in results

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "descope": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DESCOPE_PROJECT_ID",
        "-e",
        "DESCOPE_MANAGEMENT_KEY",
        "mcp/descope"
      ],
      "env": {
        "DESCOPE_PROJECT_ID": "your-descope-project-id-here",
        "DESCOPE_MANAGEMENT_KEY": "your-descope-management-key-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
