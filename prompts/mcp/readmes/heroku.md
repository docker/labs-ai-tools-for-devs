# Heroku MCP Server

Heroku Platform MCP Server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/heroku](https://hub.docker.com/repository/docker/mcp/heroku)
**Author**|[heroku](https://github.com/heroku)
**Repository**|https://github.com/heroku/heroku-mcp-server
**Dockerfile**|https://github.com/heroku/heroku-mcp-server/blob/refs/pull/24/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/heroku)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/heroku --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_addon`|Create add-on: specify service, plan, custom names|
`create_app`|Create app: custom name, region (US/EU), team, private space|
`deploy_one_off_dyno`|Run code/commands in Heroku one-off dyno with network and filesystem access.|
`deploy_to_heroku`|Use for all deployments.|
`get_addon_info`|Get add-on details: plan, state, billing|
`get_app_info`|Get app details: config, dynos, addons, access, domains|
`get_app_logs`|App logs: monitor/debug/filter by dyno/process/source|
`list_addon_plans`|List service plans: features, pricing, availability|
`list_addon_services`|List available add-on services and features|
`list_addons`|List add-ons: all apps or specific app, detailed metadata|
`list_apps`|List Heroku apps: owned, collaborator access, team/space filtering|
`list_private_spaces`|Lists Heroku Private Spaces with CIDR blocks, regions, compliance and capacity details.|
`list_teams`|Lists accessible Heroku Teams.|
`maintenance_off`|Disable maintenance mode and restore normal app operations|
`maintenance_on`|Enable maintenance mode and redirect traffic for a Heroku app|
`pg_backups`|Manage backups: schedules, status, verification, recovery|
`pg_credentials`|Manage access: credentials, permissions, security, monitoring|
`pg_info`|View database status: config, metrics, resources, health|
`pg_kill`|Stop processes: stuck queries, blocking transactions, runaway operations|
`pg_locks`|Analyze locks: blocked queries, deadlocks, concurrency|
`pg_maintenance`|Track maintenance: windows, schedules, progress, planning|
`pg_outliers`|Find resource-heavy queries: performance, patterns, optimization|
`pg_ps`|Monitor active queries: progress, resources, performance|
`pg_psql`|Execute SQL queries: analyze, debug, modify schema, manage data|
`pg_upgrade`|Upgrade PostgreSQL: version migration, compatibility, safety|
`pipelines_create`|Creates new Heroku deployment pipeline with configurable stages, apps, and team settings|
`pipelines_info`|Displays detailed pipeline configuration, stages, and connected applications|
`pipelines_list`|Lists accessible Heroku pipelines with ownership and configuration details|
`pipelines_promote`|Promotes apps between pipeline stages with configurable target applications|
`ps_list`|List and monitor Heroku app dynos.|
`ps_restart`|Restart Heroku app processes.|
`ps_scale`|Scale Heroku app dynos.|
`rename_app`|Rename app: validate and update app name|
`transfer_app`|Transfer app ownership to user/team|

---
## Tools Details

#### Tool: **`create_addon`**
Create add-on: specify service, plan, custom names
Parameters|Type|Description
-|-|-
`app`|`string`|Target app for add-on. Must have write access. Region/space affects availability
`serviceAndPlan`|`string`|Format: service_slug:plan_slug (e.g., heroku-postgresql:essential-0)
`as`|`string` *optional*|Custom attachment name. Used for config vars prefix. Must be unique in app
`name`|`string` *optional*|Global add-on identifier. Must be unique across all Heroku add-ons

---
#### Tool: **`create_app`**
Create app: custom name, region (US/EU), team, private space
Parameters|Type|Description
-|-|-
`app`|`string` *optional*|App name. Auto-generated if omitted
`region`|`string` *optional*|Region: us/eu. Default: us. Excludes space param
`space`|`string` *optional*|Private space name. Inherits region. Excludes region param
`team`|`string` *optional*|Team name for ownership

---
#### Tool: **`deploy_one_off_dyno`**
Run code/commands in Heroku one-off dyno with network and filesystem access.

Requirements:
- Show command output
- Use app_info for buildpack detection
- Support shell setup commands
- Use stdout/stderr

Features:
- Network/filesystem access
- Environment variables
- File operations
- Temp directory handling

Usage:
1. Use Heroku runtime
2. Proper syntax/imports
3. Organized code structure
4. Package management:
   - Define dependencies
   - Minimize external deps
   - Prefer native modules

Example package.json:
```json
{
  "type": "module",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```
Parameters|Type|Description
-|-|-
`command`|`string`|Command to run in dyno.
`name`|`string`|Target Heroku app name.
`env`|`object` *optional*|Dyno environment variables.
`size`|`string` *optional*|Dyno size.
`sources`|`array` *optional*|Source files to include in dyno.
`timeToLive`|`number` *optional*|Dyno lifetime in seconds.

---
#### Tool: **`deploy_to_heroku`**
Use for all deployments. Deploys new/existing apps, with or without teams/spaces, and env vars to Heroku. Ask for app name if missing. Requires valid app.json via appJson param.
Parameters|Type|Description
-|-|-
`appJson`|`string`|App.json config for deployment. Must follow schema: {"default":{"$schema":"http://json-schema.org/draft-07/schema#","title":"Heroku app.json Schema","description":"app.json is a manifest format for describing web apps. It declares environment variables, add-ons, and other information required to run an app on Heroku. Used for dynamic configurations or converted projects","type":"object","properties":{"name":{"type":"string","pattern":"^[a-zA-Z-_\\.]+","maxLength":300},"description":{"type":"string"},"keywords":{"type":"array","items":{"type":"string"}},"website":{"$ref":"#/definitions/uriString"},"repository":{"$ref":"#/definitions/uriString"},"logo":{"$ref":"#/definitions/uriString"},"success_url":{"type":"string"},"scripts":{"$ref":"#/definitions/scripts"},"env":{"$ref":"#/definitions/env"},"formation":{"$ref":"#/definitions/formation"},"addons":{"$ref":"#/definitions/addons"},"buildpacks":{"$ref":"#/definitions/buildpacks"},"environments":{"$ref":"#/definitions/environments"},"stack":{"$ref":"#/definitions/stack"},"image":{"type":"string"}},"additionalProperties":false,"definitions":{"uriString":{"type":"string","format":"uri"},"scripts":{"type":"object","properties":{"postdeploy":{"type":"string"},"pr-predestroy":{"type":"string"}},"additionalProperties":false},"env":{"type":"object","patternProperties":{"^[A-Z][A-Z0-9_]*$":{"type":"object","properties":{"description":{"type":"string"},"value":{"type":"string"},"required":{"type":"boolean"},"generator":{"type":"string","enum":["secret"]}},"additionalProperties":false}}},"dynoSize":{"type":"string","enum":["free","eco","hobby","basic","standard-1x","standard-2x","performance-m","performance-l","private-s","private-m","private-l","shield-s","shield-m","shield-l"]},"formation":{"type":"object","patternProperties":{"^[a-zA-Z0-9_-]+$":{"type":"object","properties":{"quantity":{"type":"integer","minimum":0},"size":{"$ref":"#/definitions/dynoSize"}},"required":["quantity"],"additionalProperties":false}}},"addons":{"type":"array","items":{"oneOf":[{"type":"string"},{"type":"object","properties":{"plan":{"type":"string"},"as":{"type":"string"},"options":{"type":"object"}},"required":["plan"],"additionalProperties":false}]}},"buildpacks":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"}},"required":["url"],"additionalProperties":false}},"environmentConfig":{"type":"object","properties":{"env":{"type":"object"},"formation":{"type":"object"},"addons":{"type":"array"},"buildpacks":{"type":"array"}}},"environments":{"type":"object","properties":{"test":{"allOf":[{"$ref":"#/definitions/environmentConfig"},{"type":"object","properties":{"scripts":{"type":"object","properties":{"test":{"type":"string"}},"additionalProperties":false}}}]},"review":{"$ref":"#/definitions/environmentConfig"},"production":{"$ref":"#/definitions/environmentConfig"}},"additionalProperties":false},"stack":{"type":"string","enum":["heroku-18","heroku-20","heroku-22","heroku-24"]}}}}
`name`|`string`|App name for deployment. Creates new app if not exists.
`rootUri`|`string`|Workspace root directory path.
`env`|`object` *optional*|Environment variables overriding app.json values
`internalRouting`|`boolean` *optional*|Enable internal routing in private spaces.
`spaceId`|`string` *optional*|Private space ID for space deployments.
`tarballUri`|`string` *optional*|URL of deployment tarball. Creates from rootUri if not provided.
`teamId`|`string` *optional*|Team ID for team deployments.

---
#### Tool: **`get_addon_info`**
Get add-on details: plan, state, billing
Parameters|Type|Description
-|-|-
`addon`|`string`|Add-on identifier: UUID, name (postgresql-curved-12345), or attachment name (DATABASE)
`app`|`string` *optional*|App context for add-on lookup. Required for attachment names. Uses Git remote default

---
#### Tool: **`get_app_info`**
Get app details: config, dynos, addons, access, domains
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name. Requires access permissions
`json`|`boolean` *optional*|JSON output with full metadata. Default: text format

---
#### Tool: **`get_app_logs`**
App logs: monitor/debug/filter by dyno/process/source
Parameters|Type|Description
-|-|-
`app`|`string`|Heroku app name. Requires: permissions, Cedar-gen
`dynoName`|`string` *optional*|Format: web.1/worker.2. Excludes processType
`processType`|`string` *optional*|web|worker. All instances. Excludes dynoName
`source`|`string` *optional*|app=application, heroku=platform. Default: all

---
#### Tool: **`list_addon_plans`**
List service plans: features, pricing, availability
Parameters|Type|Description
-|-|-
`service`|`string`|Service slug (e.g., heroku-postgresql). Get from list_addon_services
`json`|`boolean` *optional*|JSON output with pricing, features, space compatibility. Default: text format

---
#### Tool: **`list_addon_services`**
List available add-on services and features
Parameters|Type|Description
-|-|-
`json`|`boolean` *optional*|JSON output with sharing options and app generation support. Default: basic text

---
#### Tool: **`list_addons`**
List add-ons: all apps or specific app, detailed metadata
Parameters|Type|Description
-|-|-
`all`|`boolean` *optional*|List all add-ons across accessible apps. Overrides app param, shows full status
`app`|`string` *optional*|Filter by app name. Shows add-ons and attachments. Uses Git remote default if omitted

---
#### Tool: **`list_apps`**
List Heroku apps: owned, collaborator access, team/space filtering
Parameters|Type|Description
-|-|-
`all`|`boolean` *optional*|Show owned apps and collaborator access. Default: owned only
`personal`|`boolean` *optional*|List personal account apps only, ignoring default team
`space`|`string` *optional*|Filter by private space name. Excludes team param
`team`|`string` *optional*|Filter by team name. Excludes space param

---
#### Tool: **`list_private_spaces`**
Lists Heroku Private Spaces with CIDR blocks, regions, compliance and capacity details. JSON output supported.
Parameters|Type|Description
-|-|-
`json`|`boolean` *optional*|JSON output for detailed space metadata, text output if false/omitted

---
#### Tool: **`list_teams`**
Lists accessible Heroku Teams. Use for: viewing teams, checking membership, getting team metadata, and verifying access. JSON output available.
Parameters|Type|Description
-|-|-
`json`|`boolean` *optional*|Output format control - true for detailed JSON with team metadata, false/omitted for simplified text

---
#### Tool: **`maintenance_off`**
Disable maintenance mode and restore normal app operations
Parameters|Type|Description
-|-|-
`app`|`string`|Target Heroku app name

---
#### Tool: **`maintenance_on`**
Enable maintenance mode and redirect traffic for a Heroku app
Parameters|Type|Description
-|-|-
`app`|`string`|Target Heroku app name

---
#### Tool: **`pg_backups`**
Manage backups: schedules, status, verification, recovery
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name

---
#### Tool: **`pg_credentials`**
Manage access: credentials, permissions, security, monitoring
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: DATABASE_URL

---
#### Tool: **`pg_info`**
View database status: config, metrics, resources, health
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: all databases

---
#### Tool: **`pg_kill`**
Stop processes: stuck queries, blocking transactions, runaway operations
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`pid`|`number`|Process ID to terminate
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: DATABASE_URL
`force`|`boolean` *optional*|Force immediate termination

---
#### Tool: **`pg_locks`**
Analyze locks: blocked queries, deadlocks, concurrency
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: DATABASE_URL
`truncate`|`boolean` *optional*|Truncate queries to 40 chars

---
#### Tool: **`pg_maintenance`**
Track maintenance: windows, schedules, progress, planning
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: DATABASE_URL

---
#### Tool: **`pg_outliers`**
Find resource-heavy queries: performance, patterns, optimization
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: DATABASE_URL
`num`|`number` *optional*|Number of queries to show. Default: 10
`reset`|`boolean` *optional*|Reset pg_stat_statements stats
`truncate`|`boolean` *optional*|Truncate queries to 40 chars

---
#### Tool: **`pg_ps`**
Monitor active queries: progress, resources, performance
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: DATABASE_URL
`verbose`|`boolean` *optional*|Show query plan and memory usage

---
#### Tool: **`pg_psql`**
Execute SQL queries: analyze, debug, modify schema, manage data
Parameters|Type|Description
-|-|-
`app`|`string`|app to run command against
`command`|`string` *optional*|SQL command. Single line. Ignored if file provided
`credential`|`string` *optional*|credential to use
`database`|`string` *optional*|Database identifier: config var, name, ID, alias. Format: APP_NAME::DB for other apps. Default: DATABASE_URL
`file`|`string` *optional*|SQL file path. Ignored if command provided

---
#### Tool: **`pg_upgrade`**
Upgrade PostgreSQL: version migration, compatibility, safety
Parameters|Type|Description
-|-|-
`app`|`string`|Target app name
`confirm`|`string` *optional*|Confirmation for destructive operation
`database`|`string` *optional*|Database identifier. Format: APP_NAME::DB for other apps. Default: DATABASE_URL
`version`|`string` *optional*|PostgreSQL version target

---
#### Tool: **`pipelines_create`**
Creates new Heroku deployment pipeline with configurable stages, apps, and team settings
Parameters|Type|Description
-|-|-
`name`|`string`|Pipeline name
`stage`|`string`|Initial pipeline stage
`app`|`string` *optional*|App to add to pipeline
`team`|`string` *optional*|Team owning the pipeline

---
#### Tool: **`pipelines_info`**
Displays detailed pipeline configuration, stages, and connected applications
Parameters|Type|Description
-|-|-
`pipeline`|`string`|Target pipeline name
`json`|`boolean` *optional*|Enable JSON output

---
#### Tool: **`pipelines_list`**
Lists accessible Heroku pipelines with ownership and configuration details
Parameters|Type|Description
-|-|-
`json`|`boolean` *optional*|Enable JSON output

---
#### Tool: **`pipelines_promote`**
Promotes apps between pipeline stages with configurable target applications
Parameters|Type|Description
-|-|-
`app`|`string`|Source app for promotion
`to`|`string` *optional*|Target apps for promotion (comma-separated)

---
#### Tool: **`ps_list`**
List and monitor Heroku app dynos. View running dynos, check status/health, monitor process states, verify configurations.
Parameters|Type|Description
-|-|-
`app`|`string`|App name to list processes for
`json`|`boolean` *optional*|Output process info in JSON format

---
#### Tool: **`ps_restart`**
Restart Heroku app processes. Restart specific dynos, process types, or all dynos. Reset dyno states selectively.
Parameters|Type|Description
-|-|-
`app`|`string`|App name to restart processes for
`dyno-name`|`string` *optional*|Specific dyno to restart (e.g., web.1). Omit both options to restart all
`process-type`|`string` *optional*|Dyno type to restart (e.g., web). Omit both options to restart all

---
#### Tool: **`ps_scale`**
Scale Heroku app dynos. Adjust quantities, change sizes, view formation details, manage resources.
Parameters|Type|Description
-|-|-
`app`|`string`|App name to scale
`dyno`|`string` *optional*|Dyno type and quantity (e.g., web=3:Standard-2X, worker+1). Omit to show current formation

---
#### Tool: **`rename_app`**
Rename app: validate and update app name
Parameters|Type|Description
-|-|-
`app`|`string`|Current app name. Requires access
`newName`|`string`|New unique app name

---
#### Tool: **`transfer_app`**
Transfer app ownership to user/team
Parameters|Type|Description
-|-|-
`app`|`string`|App to transfer. Requires owner/admin access
`recipient`|`string`|Target user email or team name

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "heroku": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "HEROKU_API_KEY",
        "mcp/heroku"
      ],
      "env": {
        "HEROKU_API_KEY": "<YOUR_HEROKU_AUTH_TOKEN>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
