# Atlassian MCP Server

Tools for Atlassian products (Confluence and Jira). This integration supports both Atlassian Cloud and Jira Server/Data Center deployments.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[sooperset](https://github.com/sooperset)
**Repository**|https://github.com/sooperset/mcp-atlassian
**Dockerfile**|https://github.com/sooperset/mcp-atlassian/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`confluence_attach_content`|Attach content to a Confluence page|
`confluence_create_page`|Create a new Confluence page|
`confluence_delete_page`|Delete an existing Confluence page|
`confluence_get_comments`|Get comments for a specific Confluence page|
`confluence_get_page`|Get content of a specific Confluence page by ID|
`confluence_get_page_ancestors`|Get ancestor (parent) pages of a specific Confluence page|
`confluence_get_page_children`|Get child pages of a specific Confluence page|
`confluence_search`|Search Confluence content using simple terms or CQL|
`confluence_update_page`|Update an existing Confluence page|
`jira_add_comment`|Add a comment to a Jira issue|
`jira_add_worklog`|Add a worklog entry to a Jira issue|
`jira_batch_create_issues`|Create multiple Jira issues in a batch|
`jira_create_issue`|Create a new Jira issue with optional Epic link or parent for subtasks|
`jira_create_issue_link`|Create a link between two Jira issues|
`jira_delete_issue`|Delete an existing Jira issue|
`jira_download_attachments`|Download attachments from a Jira issue|
`jira_get_agile_boards`|Get jira agile boards by name, project key, or type|
`jira_get_board_issues`|Get all issues linked to a specific board|
`jira_get_epic_issues`|Get all issues linked to a specific epic|
`jira_get_issue`|Get details of a specific Jira issue including its Epic links and relationship information|
`jira_get_project_issues`|Get all issues for a specific Jira project|
`jira_get_sprint_issues`|Get jira issues from sprint|
`jira_get_sprints_from_board`|Get jira sprints from board by state|
`jira_get_transitions`|Get available status transitions for a Jira issue|
`jira_get_worklog`|Get worklog entries for a Jira issue|
`jira_link_to_epic`|Link an existing issue to an epic|
`jira_remove_issue_link`|Remove a link between two Jira issues|
`jira_search`|Search Jira issues using JQL (Jira Query Language)|
`jira_transition_issue`|Transition a Jira issue to a new status|
`jira_update_issue`|Update an existing Jira issue including changing status, adding Epic links, updating fields, etc.|

---
## Tools Details

#### Tool: `confluence_attach_content`
|Description|
|-|
|Attach content to a Confluence page|

Parameters|Type|Description
-|-|-
`content`|`string`|The content to attach (bytes)
`name`|`string`|The name of the attachment
`page_id`|`string`|The ID of the page to attach the content to
`content_type`|`string` *optional*|Optional: The MIME type of the content (e.g., 'image/png', 'application/pdf'). If omitted, it will be guessed from the filename.

---
#### Tool: `confluence_create_page`
|Description|
|-|
|Create a new Confluence page|

Parameters|Type|Description
-|-|-
`content`|`string`|The content of the page in Markdown format. Supports headings, lists, tables, code blocks, and other Markdown syntax
`space_key`|`string`|The key of the space to create the page in (usually a short uppercase code like 'DEV', 'TEAM', or 'DOC')
`title`|`string`|The title of the page
`parent_id`|`string` *optional*|Optional parent page ID. If provided, this page will be created as a child of the specified page

---
#### Tool: `confluence_delete_page`
|Description|
|-|
|Delete an existing Confluence page|

Parameters|Type|Description
-|-|-
`page_id`|`string`|The ID of the page to delete

---
#### Tool: `confluence_get_comments`
|Description|
|-|
|Get comments for a specific Confluence page|

Parameters|Type|Description
-|-|-
`page_id`|`string`|Confluence page ID (numeric ID, can be parsed from URL, e.g. from 'https://example.atlassian.net/wiki/spaces/TEAM/pages/123456789/Page+Title' -> '123456789')

---
#### Tool: `confluence_get_page`
|Description|
|-|
|Get content of a specific Confluence page by ID|

Parameters|Type|Description
-|-|-
`page_id`|`string`|Confluence page ID (numeric ID, can be found in the page URL). For example, in the URL 'https://example.atlassian.net/wiki/spaces/TEAM/pages/123456789/Page+Title', the page ID is '123456789'
`convert_to_markdown`|`boolean` *optional*|Whether to convert page to markdown (true) or keep it in raw HTML format (false). Raw HTML can reveal macros (like dates) not visible in markdown, but CAUTION: using HTML significantly increases token usage in AI responses.
`include_metadata`|`boolean` *optional*|Whether to include page metadata such as creation date, last update, version, and labels

---
#### Tool: `confluence_get_page_ancestors`
|Description|
|-|
|Get ancestor (parent) pages of a specific Confluence page|

Parameters|Type|Description
-|-|-
`page_id`|`string`|The ID of the page whose ancestors you want to retrieve

---
#### Tool: `confluence_get_page_children`
|Description|
|-|
|Get child pages of a specific Confluence page|

Parameters|Type|Description
-|-|-
`parent_id`|`string`|The ID of the parent page whose children you want to retrieve
`expand`|`string` *optional*|Fields to expand in the response (e.g., 'version', 'body.storage')
`include_content`|`boolean` *optional*|Whether to include the page content in the response
`limit`|`number` *optional*|Maximum number of child pages to return (1-50)

---
#### Tool: `confluence_search`
|Description|
|-|
|Search Confluence content using simple terms or CQL|

Parameters|Type|Description
-|-|-
`query`|`string`|Search query - can be either a simple text (e.g. 'project documentation') or a CQL query string. Examples of CQL:
- Basic search: 'type=page AND space=DEV'
- Personal space search: 'space="~username"' (note: personal space keys starting with ~ must be quoted)
- Search by title: 'title~"Meeting Notes"'
- Recent content: 'created >= "2023-01-01"'
- Content with specific label: 'label=documentation'
- Recently modified content: 'lastModified > startOfMonth("-1M")'
- Content modified this year: 'creator = currentUser() AND lastModified > startOfYear()'
- Content you contributed to recently: 'contributor = currentUser() AND lastModified > startOfWeek()'
- Content watched by user: 'watcher = "user@domain.com" AND type = page'
- Exact phrase in content: 'text ~ "\"Urgent Review Required\"" AND label = "pending-approval"'
- Title wildcards: 'title ~ "Minutes*" AND (space = "HR" OR space = "Marketing")'
Note: Special identifiers need proper quoting in CQL: personal space keys (e.g., "~username"), reserved words, numeric IDs, and identifiers with special characters.
`limit`|`number` *optional*|Maximum number of results (1-50)
`spaces_filter`|`string` *optional*|Comma-separated list of space keys to filter results by. Overrides the environment variable CONFLUENCE_SPACES_FILTER if provided.

---
#### Tool: `confluence_update_page`
|Description|
|-|
|Update an existing Confluence page|

Parameters|Type|Description
-|-|-
`content`|`string`|The new content of the page in Markdown format
`page_id`|`string`|The ID of the page to update
`title`|`string`|The new title of the page
`is_minor_edit`|`boolean` *optional*|Whether this is a minor edit
`version_comment`|`string` *optional*|Optional comment for this version

---
#### Tool: `jira_add_comment`
|Description|
|-|
|Add a comment to a Jira issue|

Parameters|Type|Description
-|-|-
`comment`|`string`|Comment text in Markdown format
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')

---
#### Tool: `jira_add_worklog`
|Description|
|-|
|Add a worklog entry to a Jira issue|

Parameters|Type|Description
-|-|-
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')
`time_spent`|`string`|Time spent in Jira format. Examples: '1h 30m' (1 hour and 30 minutes), '1d' (1 day), '30m' (30 minutes), '4h' (4 hours)
`comment`|`string` *optional*|Optional comment for the worklog in Markdown format
`started`|`string` *optional*|Optional start time in ISO format. If not provided, the current time will be used. Example: '2023-08-01T12:00:00.000+0000'

---
#### Tool: `jira_batch_create_issues`
|Description|
|-|
|Create multiple Jira issues in a batch|

Parameters|Type|Description
-|-|-
`issues`|`string`|JSON array of issue objects. Each object should contain:
- project_key (required): The project key (e.g., 'PROJ')
- summary (required): Issue summary/title
- issue_type (required): Type of issue (e.g., 'Task', 'Bug')
- description (optional): Issue description
- assignee (optional): Assignee username or email
- components (optional): Array of component names
Example: [
  {"project_key": "PROJ", "summary": "Issue 1", "issue_type": "Task"},
  {"project_key": "PROJ", "summary": "Issue 2", "issue_type": "Bug", "components": ["Frontend"]}
]
`validate_only`|`boolean` *optional*|If true, only validates the issues without creating them

---
#### Tool: `jira_create_issue`
|Description|
|-|
|Create a new Jira issue with optional Epic link or parent for subtasks|

Parameters|Type|Description
-|-|-
`issue_type`|`string`|Issue type (e.g. 'Task', 'Bug', 'Story', 'Epic', 'Subtask'). The available types depend on your project configuration. For subtasks, use 'Subtask' (not 'Sub-task') and include parent in additional_fields.
`project_key`|`string`|The JIRA project key (e.g. 'PROJ', 'DEV', 'SUPPORT'). This is the prefix of issue keys in your project. Never assume what it might be, always ask the user.
`summary`|`string`|Summary/title of the issue
`additional_fields`|`string` *optional*|Optional JSON string of additional fields to set. Examples:
- Set priority: {"priority": {"name": "High"}}
- Add labels: {"labels": ["frontend", "urgent"]}
- Link to parent (for any issue type): {"parent": "PROJ-123"}
- Set Fix Version/s: {"fixVersions": [{"id": "10020"}]}
- Custom fields: {"customfield_10010": "value"}
`assignee`|`string` *optional*|Assignee of the ticket (accountID, full name or e-mail)
`components`|`string` *optional*|Comma-separated list of component names to assign (e.g., 'Frontend,API')
`description`|`string` *optional*|Issue description

---
#### Tool: `jira_create_issue_link`
|Description|
|-|
|Create a link between two Jira issues|

Parameters|Type|Description
-|-|-
`inward_issue_key`|`string`|The key of the inward issue (e.g., 'PROJ-123')
`link_type`|`string`|The type of link to create (e.g., 'Duplicate', 'Blocks', 'Relates to')
`outward_issue_key`|`string`|The key of the outward issue (e.g., 'PROJ-456')
`comment`|`string` *optional*|Optional comment to add to the link
`comment_visibility`|`object` *optional*|Optional visibility settings for the comment

---
#### Tool: `jira_delete_issue`
|Description|
|-|
|Delete an existing Jira issue|

Parameters|Type|Description
-|-|-
`issue_key`|`string`|Jira issue key (e.g. PROJ-123)

---
#### Tool: `jira_download_attachments`
|Description|
|-|
|Download attachments from a Jira issue|

Parameters|Type|Description
-|-|-
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')
`target_dir`|`string`|Directory where attachments should be saved

---
#### Tool: `jira_get_agile_boards`
|Description|
|-|
|Get jira agile boards by name, project key, or type|

Parameters|Type|Description
-|-|-
`board_name`|`string` *optional*|The name of board, support fuzzy search
`board_type`|`string` *optional*|The type of jira board (e.g., 'scrum', 'kanban')
`limit`|`number` *optional*|Maximum number of results (1-50)
`project_key`|`string` *optional*|Jira project key (e.g., 'PROJ-123')
`startAt`|`number` *optional*|Starting index for pagination (0-based)

---
#### Tool: `jira_get_board_issues`
|Description|
|-|
|Get all issues linked to a specific board|

Parameters|Type|Description
-|-|-
`board_id`|`string`|The id of the board (e.g., '1001')
`jql`|`string`|JQL query string (Jira Query Language). Examples:
- Find Epics: "issuetype = Epic AND project = PROJ"
- Find issues in Epic: "parent = PROJ-123"
- Find by status: "status = 'In Progress' AND project = PROJ"
- Find by assignee: "assignee = currentUser()"
- Find recently updated: "updated >= -7d AND project = PROJ"
- Find by label: "labels = frontend AND project = PROJ"
- Find by priority: "priority = High AND project = PROJ"
`expand`|`string` *optional*|Fields to expand in the response (e.g., 'version', 'body.storage')
`fields`|`string` *optional*|Comma-separated fields to return in the results. Use '*all' for all fields, or specify individual fields like 'summary,status,assignee,priority'
`limit`|`number` *optional*|Maximum number of results (1-50)
`startAt`|`number` *optional*|Starting index for pagination (0-based)

---
#### Tool: `jira_get_epic_issues`
|Description|
|-|
|Get all issues linked to a specific epic|

Parameters|Type|Description
-|-|-
`epic_key`|`string`|The key of the epic (e.g., 'PROJ-123')
`limit`|`number` *optional*|Maximum number of issues to return (1-50)
`startAt`|`number` *optional*|Starting index for pagination (0-based)

---
#### Tool: `jira_get_issue`
|Description|
|-|
|Get details of a specific Jira issue including its Epic links and relationship information|

Parameters|Type|Description
-|-|-
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')
`comment_limit`|`integer` *optional*|Maximum number of comments to include (0 or null for no comments)
`expand`|`string` *optional*|Optional fields to expand. Examples: 'renderedFields' (for rendered content), 'transitions' (for available status transitions), 'changelog' (for history)
`fields`|`string` *optional*|Fields to return. Can be a comma-separated list (e.g., 'summary,status,customfield_10010'), '*all' for all fields (including custom fields), or omitted for essential fields only
`properties`|`string` *optional*|A comma-separated list of issue properties to return
`update_history`|`boolean` *optional*|Whether to update the issue view history for the requesting user

---
#### Tool: `jira_get_project_issues`
|Description|
|-|
|Get all issues for a specific Jira project|

Parameters|Type|Description
-|-|-
`project_key`|`string`|The project key
`limit`|`number` *optional*|Maximum number of results (1-50)
`startAt`|`number` *optional*|Starting index for pagination (0-based)

---
#### Tool: `jira_get_sprint_issues`
|Description|
|-|
|Get jira issues from sprint|

Parameters|Type|Description
-|-|-
`sprint_id`|`string`|The id of sprint (e.g., '10001')
`fields`|`string` *optional*|Comma-separated fields to return in the results. Use '*all' for all fields, or specify individual fields like 'summary,status,assignee,priority'
`limit`|`number` *optional*|Maximum number of results (1-50)
`startAt`|`number` *optional*|Starting index for pagination (0-based)

---
#### Tool: `jira_get_sprints_from_board`
|Description|
|-|
|Get jira sprints from board by state|

Parameters|Type|Description
-|-|-
`board_id`|`string` *optional*|The id of board (e.g., '1000')
`limit`|`number` *optional*|Maximum number of results (1-50)
`startAt`|`number` *optional*|Starting index for pagination (0-based)
`state`|`string` *optional*|Sprint state (e.g., 'active', 'future', 'closed')

---
#### Tool: `jira_get_transitions`
|Description|
|-|
|Get available status transitions for a Jira issue|

Parameters|Type|Description
-|-|-
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')

---
#### Tool: `jira_get_worklog`
|Description|
|-|
|Get worklog entries for a Jira issue|

Parameters|Type|Description
-|-|-
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')

---
#### Tool: `jira_link_to_epic`
|Description|
|-|
|Link an existing issue to an epic|

Parameters|Type|Description
-|-|-
`epic_key`|`string`|The key of the epic to link to (e.g., 'PROJ-456')
`issue_key`|`string`|The key of the issue to link (e.g., 'PROJ-123')

---
#### Tool: `jira_remove_issue_link`
|Description|
|-|
|Remove a link between two Jira issues|

Parameters|Type|Description
-|-|-
`link_id`|`string`|The ID of the link to remove

---
#### Tool: `jira_search`
|Description|
|-|
|Search Jira issues using JQL (Jira Query Language)|

Parameters|Type|Description
-|-|-
`jql`|`string`|JQL query string (Jira Query Language). Examples:
- Find Epics: "issuetype = Epic AND project = PROJ"
- Find issues in Epic: "parent = PROJ-123"
- Find by status: "status = 'In Progress' AND project = PROJ"
- Find by assignee: "assignee = currentUser()"
- Find recently updated: "updated >= -7d AND project = PROJ"
- Find by label: "labels = frontend AND project = PROJ"
- Find by priority: "priority = High AND project = PROJ"
`fields`|`string` *optional*|Comma-separated fields to return in the results. Use '*all' for all fields, or specify individual fields like 'summary,status,assignee,priority'
`limit`|`number` *optional*|Maximum number of results (1-50)
`projects_filter`|`string` *optional*|Comma-separated list of project keys to filter results by. Overrides the environment variable JIRA_PROJECTS_FILTER if provided.
`startAt`|`number` *optional*|Starting index for pagination (0-based)

---
#### Tool: `jira_transition_issue`
|Description|
|-|
|Transition a Jira issue to a new status|

Parameters|Type|Description
-|-|-
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')
`transition_id`|`string`|ID of the transition to perform. Use the jira_get_transitions tool first to get the available transition IDs for the issue. Example values: '11', '21', '31'
`comment`|`string` *optional*|Comment to add during the transition (optional). This will be visible in the issue history.
`fields`|`string` *optional*|JSON string of fields to update during the transition. Some transitions require specific fields to be set. Example: '{"resolution": {"name": "Fixed"}}'

---
#### Tool: `jira_update_issue`
|Description|
|-|
|Update an existing Jira issue including changing status, adding Epic links, updating fields, etc.|

Parameters|Type|Description
-|-|-
`fields`|`string`|A valid JSON object of fields to update as a string. Example: '{"summary": "New title", "description": "Updated description", "priority": {"name": "High"}, "assignee": {"name": "john.doe"}}'
`issue_key`|`string`|Jira issue key (e.g., 'PROJ-123')
`additional_fields`|`string` *optional*|Optional JSON string of additional fields to update. Use this for custom fields or more complex updates.
`attachments`|`string` *optional*|Optional JSON string or comma-separated list of file paths to attach to the issue. Example: "/path/to/file1.txt,/path/to/file2.txt" or "["/path/to/file1.txt","/path/to/file2.txt"]"

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "CONFLUENCE_URL",
        "-e",
        "CONFLUENCE_USERNAME",
        "-e",
        "JIRA_URL",
        "-e",
        "JIRA_USERNAME",
        "-e",
        "JIRA_API_TOKEN",
        "-e",
        "CONFLUENCE_API_TOKEN",
        "mcp/atlassian"
      ],
      "env": {
        "CONFLUENCE_URL": "https://your-company.atlassian.net/wiki"",
        "CONFLUENCE_USERNAME": "your.email@company.com",
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_USERNAME": "your.email@company.com",
        "JIRA_API_TOKEN": "your_api_token",
        "CONFLUENCE_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
