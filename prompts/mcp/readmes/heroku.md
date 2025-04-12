# heroku MCP Server

Heroku Platform MCP Server

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [heroku](https://github.com/heroku) |
| **Repository** | https://github.com/heroku/heroku-mcp-server |
| **Dockerfile** | https://github.com/heroku/heroku-mcp-server/blob/refs/pull/24/merge/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | Apache License 2.0 |

## Tools Summary

 1. **`create_addon`**: Create a new Heroku add-on for an application. Use this tool when you need to: 1) Provision a new add-on for your app, 2) Specify a particular service and plan, 3) Set a custom name for the add-on or attachment. The tool handles the provisioning process and returns the new add-on's details.
 1. **`create_app`**: Create a new Heroku application with customizable settings. Use this tool when a user wants to: 1) Create a new app with a specific name, 2) Create an app in a particular region (US/EU), 3) Create an app within a team, or 4) Create an app in a private space. The tool handles name generation if not specified and returns the new app's details.
 1. **`deploy_one_off_dyno`**: Execute code or a command on a Heroku one-off dyno in a sandboxed environment with network and filesystem access.

**Requirements:**
- Display command output to the user.
- Determine app language using the 'app_info' tool to identify the Heroku buildpack.
- Use shell commands for environment setup (e.g., package installations) before execution.
- Output must utilize standard input/output.

**Capabilities:**
- Network and filesystem access
- Environment variables support
- File creation and execution in supported languages
- Temporary directory management

**Guidelines:**
1. Use the appropriate Heroku-supported language runtime.
2. Ensure correct syntax and module imports for the chosen language.
3. Organize code into classes/functions, executed from the top level.
4. For external packages:
   - Specify in the appropriate package manager file.
   - Minimize dependencies.
   - Prefer native modules when possible.

**Example (Node.js package manager file):**
```json
{
  "type": "module",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```
 1. **`deploy_to_heroku`**: Deploy projects to Heroku, replaces manual git push workflows. Use this tool when you need to: 1) Deploy a new application with specific app.json configuration, 2) Update an existing application with new code, 3) Configure team or private space deployments, or 4) Set up environment-specific configurations. Important: Check for an app.json file first. If an app.json does not exist in the workspace, you must create one and pass it in via the appJson parameter. The tool handles app creation, source code deployment, and environment setup. Requires valid app.json in workspace or provided via configuration. Supports team deployments, private spaces, and custom environment variables.Use apps_list tool with the "all" param to get a list of apps for the user to choose from when deploying to an existing app and the app name was not provided.
 1. **`get_addon_info`**: Get comprehensive information about a Heroku add-on. Use this tool when you need to: 1) View add-on details, 2) Check plan details and state, 3) View billing information. Accepts add-on ID, name, or attachment name.
 1. **`get_app_info`**: Get comprehensive information about a Heroku application. Use this tool when you need to: 1) View app configuration and settings, 2) Check dyno formation and scaling, 3) List add-ons and buildpacks, 4) View collaborators and access details, 5) Check domains and certificates. Accepts app name and optional JSON format. Returns detailed app status and configuration.
 1. **`get_app_logs`**: View application logs with flexible filtering options. Use this tool when you need to: 1) Monitor application activity in real-time, 2) Debug issues by viewing recent logs, 3) Filter logs by dyno, process type, or source.
 1. **`list_addon_plans`**: List available plans for a specific Heroku add-on service. Use this tool when you need to: 1) View all plans for a service, 2) Compare plan pricing, 3) Check plan availability. Requires add-on service slug and returns detailed plan information.
 1. **`list_addon_services`**: List available Heroku add-on services. Use this tool when you need to view all available add-on services. Returns a list of add-on services with their basic information.
 1. **`list_addons`**: List Heroku add-ons with flexible filtering options. Use this tool when you need to: 1) View all add-ons across your apps, 2) List add-ons for a specific app, 3) Get detailed add-on metadata in JSON format.
 1. **`list_apps`**: List Heroku applications with flexible filtering options. Use this tool when you need to: 1) Show all apps owned by the user, 2) Show apps where the user is a collaborator (use all=true), 3) Filter apps by team or private space. Note: For checking app name availability, prefer using get_app_info as it returns a more focused dataset. The response includes app names, regions, and ownership information.
 1. **`list_private_spaces`**: List Heroku Private Spaces available to the user. Use this tool when you need to: 1) View all private spaces, 2) Get space details like CIDR blocks and regions, 3) Check space compliance features, or 4) View space capacity information. Supports JSON output for detailed metadata. Essential for enterprise space management.
 1. **`list_teams`**: List Heroku Teams the user belongs to. Use this tool when you need to: 1) View all accessible teams, 2) Check team membership, 3) Get team metadata and enterprise relationships, or 4) Verify team access for app operations. Supports JSON output for detailed team information.
 1. **`maintenance_off`**: Disable maintenance mode for Heroku applications. Use this tool when you need to: 1) Restore normal application traffic routing, 2) Resume dyno operations after maintenance, 3) Complete deployment processes, 4) Verify application health after maintenance. The tool handles service restoration and process resumption.
 1. **`maintenance_on`**: Enable maintenance mode for Heroku applications. Use this tool when you need to: 1) Redirect traffic to a maintenance page, 2) Prepare for system updates or deployments, 3) Schedule planned maintenance windows, 4) Gracefully handle service interruptions. The tool manages traffic routing and process states while preserving running operations.
 1. **`pg_backups`**: Manage database backup operations and schedules. Use this tool when you need to: 1) View existing database backups, 2) Monitor backup schedules and status, 3) Track backup operation progress, 4) Verify backup availability. The tool helps maintain database backup operations and disaster recovery readiness.
 1. **`pg_credentials`**: Manage database access credentials and security. Use this tool when you need to: 1) View current database credentials, 2) Configure database access permissions, 3) Rotate credentials for security compliance, 4) Set up monitoring access. The tool helps maintain secure database access and credential management.
 1. **`pg_info`**: Display detailed information about Heroku PostgreSQL databases. Use this tool when you need to: 1) View comprehensive database configuration and status, 2) Monitor database performance metrics, 3) Check connection and resource utilization, 4) Assess database health and capacity. The tool provides detailed insights into database operations and configuration.
 1. **`pg_kill`**: Terminate specific database processes. Use this tool when you need to: 1) Stop problematic or stuck queries, 2) Clear blocking transactions, 3) Manage resource-intensive operations, 4) Handle runaway processes safely. The tool provides controlled process termination with optional force mode.
 1. **`pg_locks`**: Analyze database locks and blocking transactions. Use this tool when you need to: 1) Identify blocked queries and lock chains, 2) Investigate deadlock situations, 3) Monitor transaction lock states, 4) Resolve blocking issues affecting performance. The tool helps diagnose and resolve database concurrency problems.
 1. **`pg_maintenance`**: Monitor database maintenance status and operations. Use this tool when you need to: 1) Check current maintenance windows, 2) View scheduled maintenance activities, 3) Track maintenance operation progress, 4) Plan database maintenance tasks. The tool provides visibility into database maintenance state and scheduling.
 1. **`pg_outliers`**: Identify resource-intensive database operations. Use this tool when you need to: 1) Find slow or expensive queries, 2) Analyze query performance patterns, 3) Optimize database workload, 4) Track query statistics over time. The tool helps identify opportunities for performance optimization.
 1. **`pg_ps`**: Monitor active database queries and processes. Use this tool when you need to: 1) View currently executing queries, 2) Track query progress and resource usage, 3) Identify long-running or blocked queries, 4) Debug performance issues in real-time. The tool provides detailed visibility into database activity with optional verbose output.
 1. **`pg_psql`**: Execute SQL queries against Heroku PostgreSQL databases. Use this tool when you need to: 1) Run SQL queries for database analysis, 2) Investigate database locks and performance, 3) Make schema modifications or updates, 4) Execute complex database operations. The tool provides direct SQL access with support for file-based queries and credential management.
 1. **`pg_upgrade`**: Upgrade PostgreSQL database version. Use this tool when you need to: 1) Migrate to a newer PostgreSQL version, 2) Plan version upgrade paths, 3) Execute controlled version migrations, 4) Verify upgrade compatibility. The tool manages safe database version upgrades with confirmation protection.
 1. **`pipelines_create`**: Create new Heroku deployment pipelines. Use this tool when you need to: 1) Set up new deployment workflows, 2) Create staged application environments, 3) Organize apps by development stages, 4) Configure team-based pipeline structures. The tool manages pipeline creation with optional team and initial app configuration.
 1. **`pipelines_info`**: Display detailed pipeline configuration. Use this tool when you need to: 1) View pipeline stage configuration, 2) Check connected applications, 3) Verify pipeline settings, 4) Monitor pipeline status. The tool provides comprehensive pipeline information and structure details.
 1. **`pipelines_list`**: View available Heroku pipelines. Use this tool when you need to: 1) List accessible pipelines, 2) Check pipeline ownership and access, 3) View pipeline organization, 4) Find specific pipeline configurations. The tool provides pipeline visibility with optional JSON output format.
 1. **`pipelines_promote`**: Promote applications through pipeline stages. Use this tool when you need to: 1) Deploy code to staging or production environments, 2) Manage staged releases, 3) Coordinate multi-app promotions, 4) Control deployment workflows. The tool handles safe promotion of apps between pipeline stages.
 1. **`ps_list`**: List and monitor Heroku application dynos. Use this tool when you need to: 1) View all running dynos for an app, 2) Check dyno status and health, 3) Monitor application process states, 4) Verify dyno configurations. The tool provides process visibility with optional JSON output format.
 1. **`ps_restart`**: Restart Heroku application processes. Use this tool when you need to: 1) Restart specific dynos by name, 2) Restart all dynos of a process type, 3) Perform full application restarts, 4) Reset dyno states selectively. The tool manages process restarts with flexible targeting options.
 1. **`ps_scale`**: Scale and resize Heroku application dynos. Use this tool when you need to: 1) Adjust dyno quantities up or down, 2) Change dyno sizes for performance, 3) View current formation details, 4) Manage resource allocation. The tool handles dyno scaling with support for type-specific adjustments.
 1. **`rename_app`**: Rename an existing Heroku application. Use this tool when a user needs to: 1) Change an app's name, or 2) Resolve naming conflicts. Requires both current app name and desired new name. The tool validates name availability and handles the rename process.
 1. **`transfer_app`**: Transfer ownership of a Heroku application. Use this tool when a user wants to: 1) Transfer an app to another user's account, 2) Move an app to a team, 3) Change app ownership for organizational purposes. Requires the app name and recipient (email for users, name for teams). The current user must be the app owner or a team admin to perform the transfer.

## Tools

### Tool: **`create_addon`**

Create a new Heroku add-on for an application. Use this tool when you need to: 1) Provision a new add-on for your app, 2) Specify a particular service and plan, 3) Set a custom name for the add-on or attachment. The tool handles the provisioning process and returns the new add-on's details.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | Specifies the target Heroku app for add-on provisioning. Requirements and behaviors: 1) App must exist and be accessible to you with write permissions, 2) App region may affect which add-on services are available, 3) If app is in a Private Space, only add-ons compliant with the space requirements can be provisioned. The add-on will be provisioned directly to this app and config vars will be set automatically. |
| `serviceAndPlan` | `string` | Specifies which add-on service and plan to provision. Format and behavior: 1) Required format: "service_slug:plan_slug" (e.g., "heroku-postgresql:essential-0"), 2) If only service slug provided, the default (usually the cheapest or free) plan will be selected, 3) Some plans may have prerequisites (e.g., inside a private space, specific regions). Use list_addon_services and list_addon_plans tools to discover available options. |
| `as` | `string` *optional* | Sets a custom local name for the add-on attachment in the app. Important details: 1) Must be unique within the app (no other attachment can use the same name), 2) Used as a prefix for config vars (e.g., "CUSTOM_NAME_URL" instead of "HEROKU_POSTGRESQL_URL"), 3) Makes the add-on easier to identify in app context (e.g., "as: DATABASE" is clearer than "postgresql-curved-12345"), 4) When omitted, Heroku generates a default name based on the add-on service. Best practice: Use meaningful names that indicate the add-on's purpose (e.g., "PRIMARY_DB", "CACHE"). |
| `name` | `string` *optional* | Assigns a custom global identifier for the add-on instance. Key characteristics: 1) Must be unique across all add-ons in Heroku (not just your apps), 2) Can be used to reference the add-on from any app or context, 3) Useful for identifying the add-on in cross-app scenarios or automation, 4) When omitted, Heroku generates a unique name (e.g., "postgresql-curved-12345"). Best practice: Include app name or environment if using custom names (e.g., "myapp-prod-db"). |

### Tool: **`create_app`**

Create a new Heroku application with customizable settings. Use this tool when a user wants to: 1) Create a new app with a specific name, 2) Create an app in a particular region (US/EU), 3) Create an app within a team, or 4) Create an app in a private space. The tool handles name generation if not specified and returns the new app's details.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` *optional* | Specifies the desired name for the new Heroku app. If omitted, Heroku will auto-generate a random name. Best practice: Provide a meaningful, unique name that reflects your application's purpose. |
| `region` | `string` *optional* | Determines the geographical region where your app will run. Options: "us" (United States) or "eu" (Europe). Defaults to "us" if not specified. Note: Cannot be used with space parameter. |
| `space` | `string` *optional* | Places the app in a specific private space, which provides enhanced security and networking features. Specify the private space name. Note: When used, the app inherits the region from the private space and the region parameter cannot be used. |
| `team` | `string` *optional* | Associates the app with a specific team for collaborative development and management. Provide the team name to set ownership. The app will be created under the team's account rather than your personal account. |

### Tool: **`deploy_one_off_dyno`**

Execute code or a command on a Heroku one-off dyno in a sandboxed environment with network and filesystem access.

**Requirements:**
- Display command output to the user.
- Determine app language using the 'app_info' tool to identify the Heroku buildpack.
- Use shell commands for environment setup (e.g., package installations) before execution.
- Output must utilize standard input/output.

**Capabilities:**
- Network and filesystem access
- Environment variables support
- File creation and execution in supported languages
- Temporary directory management

**Guidelines:**
1. Use the appropriate Heroku-supported language runtime.
2. Ensure correct syntax and module imports for the chosen language.
3. Organize code into classes/functions, executed from the top level.
4. For external packages:
   - Specify in the appropriate package manager file.
   - Minimize dependencies.
   - Prefer native modules when possible.

**Example (Node.js package manager file):**
```json
{
  "type": "module",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

| Parameter | Type | Description |
| - | - | - |
| `command` | `string` | Command to execute in the one-off dyno. |
| `name` | `string` | Name of the Heroku app for the one-off dyno. |
| `env` | `object` *optional* | Environment variables for the dyno (optional). |
| `size` | `string` *optional* | Dyno size (optional). |
| `sources` | `array` *optional* | Array of objects representing the source files to include in the dyno. |
| `timeToLive` | `number` *optional* | Dyno lifespan in seconds (optional). |

### Tool: **`deploy_to_heroku`**

Deploy projects to Heroku, replaces manual git push workflows. Use this tool when you need to: 1) Deploy a new application with specific app.json configuration, 2) Update an existing application with new code, 3) Configure team or private space deployments, or 4) Set up environment-specific configurations. Important: Check for an app.json file first. If an app.json does not exist in the workspace, you must create one and pass it in via the appJson parameter. The tool handles app creation, source code deployment, and environment setup. Requires valid app.json in workspace or provided via configuration. Supports team deployments, private spaces, and custom environment variables.Use apps_list tool with the "all" param to get a list of apps for the user to choose from when deploying to an existing app and the app name was not provided.

| Parameter | Type | Description |
| - | - | - |
| `appJson` | `string` | Stringified app.json configuration for deployment. Used for dynamic configurations or converted projects.
  The app.json string must be valid and conform to the following schema: {"default":{"$schema":"http://json-schema.org/draft-07/schema#","title":"Heroku app.json Schema","description":"app.json is a manifest format for describing web apps. It declares environment variables, add-ons, and other information required to run an app on Heroku. Used for dynamic configurations or converted projects","type":"object","properties":{"name":{"type":"string","pattern":"^[a-zA-Z-_\\.]+","maxLength":300},"description":{"type":"string"},"keywords":{"type":"array","items":{"type":"string"}},"website":{"$ref":"#/definitions/uriString"},"repository":{"$ref":"#/definitions/uriString"},"logo":{"$ref":"#/definitions/uriString"},"success_url":{"type":"string"},"scripts":{"$ref":"#/definitions/scripts"},"env":{"$ref":"#/definitions/env"},"formation":{"$ref":"#/definitions/formation"},"addons":{"$ref":"#/definitions/addons"},"buildpacks":{"$ref":"#/definitions/buildpacks"},"environments":{"$ref":"#/definitions/environments"},"stack":{"$ref":"#/definitions/stack"},"image":{"type":"string"}},"additionalProperties":false,"definitions":{"uriString":{"type":"string","format":"uri"},"scripts":{"type":"object","properties":{"postdeploy":{"type":"string"},"pr-predestroy":{"type":"string"}},"additionalProperties":false},"env":{"type":"object","patternProperties":{"^[A-Z][A-Z0-9_]*$":{"type":"object","properties":{"description":{"type":"string"},"value":{"type":"string"},"required":{"type":"boolean"},"generator":{"type":"string","enum":["secret"]}},"additionalProperties":false}}},"dynoSize":{"type":"string","enum":["free","eco","hobby","basic","standard-1x","standard-2x","performance-m","performance-l","private-s","private-m","private-l","shield-s","shield-m","shield-l"]},"formation":{"type":"object","patternProperties":{"^[a-zA-Z0-9_-]+$":{"type":"object","properties":{"quantity":{"type":"integer","minimum":0},"size":{"$ref":"#/definitions/dynoSize"}},"required":["quantity"],"additionalProperties":false}}},"addons":{"type":"array","items":{"oneOf":[{"type":"string"},{"type":"object","properties":{"plan":{"type":"string"},"as":{"type":"string"},"options":{"type":"object"}},"required":["plan"],"additionalProperties":false}]}},"buildpacks":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"}},"required":["url"],"additionalProperties":false}},"environmentConfig":{"type":"object","properties":{"env":{"type":"object"},"formation":{"type":"object"},"addons":{"type":"array"},"buildpacks":{"type":"array"}}},"environments":{"type":"object","properties":{"test":{"allOf":[{"$ref":"#/definitions/environmentConfig"},{"type":"object","properties":{"scripts":{"type":"object","properties":{"test":{"type":"string"}},"additionalProperties":false}}}]},"review":{"$ref":"#/definitions/environmentConfig"},"production":{"$ref":"#/definitions/environmentConfig"}},"additionalProperties":false},"stack":{"type":"string","enum":["heroku-18","heroku-20","heroku-22","heroku-24"]}}}} |
| `name` | `string` | Heroku application name for deployment target. If omitted, a new app will be created with a random name. If supplied and the app does not exist, the tool will create a new app with the given name. |
| `rootUri` | `string` | The absolute path of the user's workspace unless otherwise specified by the user. Must be a string that can be resolved to a valid directory using node's path module. |
| `env` | `object` *optional* | Key-value pairs of environment variables for the deployment that override the ones in app.json |
| `internalRouting` | `boolean` *optional* | Enables internal routing within private spaces. Use this flag when you need to configure private spaces for internal routing. |
| `spaceId` | `string` *optional* | Heroku private space identifier for space-scoped deployments. Use spaces_list tool to get a list of spaces if needed. |
| `tarballUri` | `string` *optional* | The URL of the tarball to deploy. If not provided, the rootUri must be provided and the tool will create a new tarball from the contents of the rootUri. |
| `teamId` | `string` *optional* | Heroku team identifier for team-scoped deployments. Use teams_list tool to get a list of teams if needed. |

### Tool: **`get_addon_info`**

Get comprehensive information about a Heroku add-on. Use this tool when you need to: 1) View add-on details, 2) Check plan details and state, 3) View billing information. Accepts add-on ID, name, or attachment name.

| Parameter | Type | Description |
| - | - | - |
| `addon` | `string` | Identifies the add-on to retrieve information about. Accepts three types of identifiers: 1) Add-on ID (uuid format, works globally without app context), 2) Add-on name (e.g., "postgresql-curved-12345", works globally without app context), 3) Attachment name (e.g., "DATABASE", requires app context). Important behaviors: - When using attachment name, must provide app flag or have default app set, - Attachment name must be from the app where attached, not the provisioning app, - Add-on ID and unique names work with correct app context or without app context, - Must have access to the app where the add-on is either provisioned or attached. |
| `app` | `string` *optional* | Provides application context for finding the add-on. Affects how the addon parameter is interpreted: 1) When provided:    - Searches for the add-on only within this specific app,    - Enables use of attachment names in the addon parameter,    - Must have access to this app. 2) When omitted:    - First tries using default app from Git remote configuration,    - If no default app, addon parameter must be an ID or globally unique name,    - Cannot use attachment names without app context. Best practice: Always provide when using attachment names. |

### Tool: **`get_app_info`**

Get comprehensive information about a Heroku application. Use this tool when you need to: 1) View app configuration and settings, 2) Check dyno formation and scaling, 3) List add-ons and buildpacks, 4) View collaborators and access details, 5) Check domains and certificates. Accepts app name and optional JSON format. Returns detailed app status and configuration.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app to get information about. This must be an existing app that you have access to. |
| `json` | `boolean` *optional* | Controls the output format. When true, returns a detailed JSON response containing app metadata such as add-ons, dynos, buildpack configurations, collaborators, and domain information. When false or omitted, returns a simplified text format. |

### Tool: **`get_app_logs`**

View application logs with flexible filtering options. Use this tool when you need to: 1) Monitor application activity in real-time, 2) Debug issues by viewing recent logs, 3) Filter logs by dyno, process type, or source.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | Specifies the target Heroku app whose logs to retrieve. Requirements and behaviors: 1) App must exist and be accessible to you with appropriate permissions, 2) The response includes both system events and application output, 3) Currently it's only available to Cedar generation apps. |
| `dynoName` | `string` *optional* | Filter logs by specific dyno instance. Important behaviors: 1) Format is "process_type.instance_number" (e.g., "web.1", "worker.2"). 2) You cannot specify both dynoName and processType parameters together. Best practice: Use when debugging specific dyno behavior or performance issues. |
| `processType` | `string` *optional* | Filter logs by process type. Key characteristics: 1) Common values: "web" (web dynos), "worker" (background workers), 2) Shows logs from all instances of the specified process type, 3) You cannot specify both dynoName and processType parameters together. Best practice: Use when debugging issues specific to web or worker processes. |
| `source` | `string` *optional* | Filter logs by their origin. Key characteristics: 1) Common values: "app" (application logs), "heroku" (platform events), 2) When omitted, shows logs from all sources. Best practice: Use "app" for application debugging, "heroku" for platform troubleshooting. |

### Tool: **`list_addon_plans`**

List available plans for a specific Heroku add-on service. Use this tool when you need to: 1) View all plans for a service, 2) Compare plan pricing, 3) Check plan availability. Requires add-on service slug and returns detailed plan information.

| Parameter | Type | Description |
| - | - | - |
| `service` | `string` | Identifies the add-on service whose plans you want to list. Requirements and behaviors: 1) Must be a valid service slug (e.g., "heroku-postgresql", "heroku-redis", etc.), 2) Can be obtained from the list_addon_services command output.  |
| `json` | `boolean` *optional* | Controls the response format and detail level. When true, returns a structured JSON response containing additional add-on plan metadata including descriptions, pricing and indicating if the plan is installableinside a private space or not. When false or omitted, returns a human-readable text format. |

### Tool: **`list_addon_services`**

List available Heroku add-on services. Use this tool when you need to view all available add-on services. Returns a list of add-on services with their basic information.

| Parameter | Type | Description |
| - | - | - |
| `json` | `boolean` *optional* | Controls the output format. When true, returns a detailed JSON response containing additional add-on service metadata such as sharing options and supported app generations. When false or omitted, returns a simplified text format including only the add-on service slug, name and state. |

### Tool: **`list_addons`**

List Heroku add-ons with flexible filtering options. Use this tool when you need to: 1) View all add-ons across your apps, 2) List add-ons for a specific app, 3) Get detailed add-on metadata in JSON format.

| Parameter | Type | Description |
| - | - | - |
| `all` | `boolean` *optional* | Forces the tool to list all add-ons across all apps accessible to the user. When true, this flag: 1) Overrides any default app setting from Git remote configuration, 2) Ignores the app flag if provided, 3) Shows a comprehensive list including: app name, add-on name, service plan, billing status, and provisioning status for each add-on. When false or omitted, respects the default app setting and the app flag. |
| `app` | `string` *optional* | Specifies a single Heroku app whose add-ons you want to list. Important behaviors: 1) When provided, shows add-ons and attachments only for this specific app, 2) When omitted, falls back to the default app from Git remote if configured, 3) If no default app exists, lists add-ons for all accessible apps, 4) This flag is completely ignored when all=true. The response includes both provisioned add-ons and add-on attachments from other apps. |
| `json` | `boolean` *optional* | Controls the response format and detail level. When true, returns a structured JSON response containing: 1) Complete add-on metadata including ID, name, and creation timestamp, 2) Detailed plan information including tier and cost, 3) Configuration variables set by the add-on, 4) Attachment details if the add-on is shared with other apps, 5) Billing and compliance status information. When false or omitted, returns a human-readable text format with basic information. |

### Tool: **`list_apps`**

List Heroku applications with flexible filtering options. Use this tool when you need to: 1) Show all apps owned by the user, 2) Show apps where the user is a collaborator (use all=true), 3) Filter apps by team or private space. Note: For checking app name availability, prefer using get_app_info as it returns a more focused dataset. The response includes app names, regions, and ownership information.

| Parameter | Type | Description |
| - | - | - |
| `all` | `boolean` *optional* | When true, displays a comprehensive list including: (1) apps owned by the user and (2) apps where the user is a collaborator through direct access or team membership. When false or omitted, shows only owned apps. |
| `json` | `boolean` *optional* | Controls the output format. When true, returns a detailed JSON response containing app metadata such as generation, buildpacks, owner information, and region. When false or omitted, returns a simplified text format. |
| `personal` | `boolean` *optional* | Forces the tool to list applications from your personal account, even when you have a default team configured. When true, overrides any default team setting and shows only apps owned by your personal account. This is particularly useful when you work with multiple teams but need to specifically view your personal apps. When false or omitted, follows the default behavior of using the default team if one is set. |
| `space` | `string` *optional* | Filters the results to show only apps within a specific private space. Provide the private space name to filter. This parameter is mutually exclusive with the team parameter. |
| `team` | `string` *optional* | Filters the results to show only apps belonging to a specific team. Provide the team name to filter. This parameter is mutually exclusive with the space parameter. |

### Tool: **`list_private_spaces`**

List Heroku Private Spaces available to the user. Use this tool when you need to: 1) View all private spaces, 2) Get space details like CIDR blocks and regions, 3) Check space compliance features, or 4) View space capacity information. Supports JSON output for detailed metadata. Essential for enterprise space management.

| Parameter | Type | Description |
| - | - | - |
| `json` | `boolean` *optional* | Controls the output format. When true, returns a detailed JSON response containing private space metadata such as generation's unsupported features, IPv4 and IPv6 CIDR blocks. When false or omitted, returns a simplified text format. |

### Tool: **`list_teams`**

List Heroku Teams the user belongs to. Use this tool when you need to: 1) View all accessible teams, 2) Check team membership, 3) Get team metadata and enterprise relationships, or 4) Verify team access for app operations. Supports JSON output for detailed team information.

| Parameter | Type | Description |
| - | - | - |
| `json` | `boolean` *optional* | Controls the output format. When true, returns a detailed JSON response containing team metadata such as enterprise account name. When false or omitted, returns a simplified text format. |

### Tool: **`maintenance_off`**

Disable maintenance mode for Heroku applications. Use this tool when you need to: 1) Restore normal application traffic routing, 2) Resume dyno operations after maintenance, 3) Complete deployment processes, 4) Verify application health after maintenance. The tool handles service restoration and process resumption.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app to modify maintenance mode for. This must be an existing app that you have access to. |

### Tool: **`maintenance_on`**

Enable maintenance mode for Heroku applications. Use this tool when you need to: 1) Redirect traffic to a maintenance page, 2) Prepare for system updates or deployments, 3) Schedule planned maintenance windows, 4) Gracefully handle service interruptions. The tool manages traffic routing and process states while preserving running operations.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app to modify maintenance mode for. This must be an existing app that you have access to. |

### Tool: **`pg_backups`**

Manage database backup operations and schedules. Use this tool when you need to: 1) View existing database backups, 2) Monitor backup schedules and status, 3) Track backup operation progress, 4) Verify backup availability. The tool helps maintain database backup operations and disaster recovery readiness.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose backups to manage. |

### Tool: **`pg_credentials`**

Manage database access credentials and security. Use this tool when you need to: 1) View current database credentials, 2) Configure database access permissions, 3) Rotate credentials for security compliance, 4) Set up monitoring access. The tool helps maintain secure database access and credential management.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose database credentials to view. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |

### Tool: **`pg_info`**

Display detailed information about Heroku PostgreSQL databases. Use this tool when you need to: 1) View comprehensive database configuration and status, 2) Monitor database performance metrics, 3) Check connection and resource utilization, 4) Assess database health and capacity. The tool provides detailed insights into database operations and configuration.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose database to inspect. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, all databases are shown. |

### Tool: **`pg_kill`**

Terminate specific database processes. Use this tool when you need to: 1) Stop problematic or stuck queries, 2) Clear blocking transactions, 3) Manage resource-intensive operations, 4) Handle runaway processes safely. The tool provides controlled process termination with optional force mode.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose database process to terminate. |
| `pid` | `number` | The process ID to terminate, as shown by pg_ps. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |
| `force` | `boolean` *optional* | When true, forces immediate termination instead of graceful shutdown. |

### Tool: **`pg_locks`**

Analyze database locks and blocking transactions. Use this tool when you need to: 1) Identify blocked queries and lock chains, 2) Investigate deadlock situations, 3) Monitor transaction lock states, 4) Resolve blocking issues affecting performance. The tool helps diagnose and resolve database concurrency problems.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose database locks to view. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |
| `truncate` | `boolean` *optional* | When true, truncates queries to 40 characters. |

### Tool: **`pg_maintenance`**

Monitor database maintenance status and operations. Use this tool when you need to: 1) Check current maintenance windows, 2) View scheduled maintenance activities, 3) Track maintenance operation progress, 4) Plan database maintenance tasks. The tool provides visibility into database maintenance state and scheduling.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | Show current maintenance information for the app. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |

### Tool: **`pg_outliers`**

Identify resource-intensive database operations. Use this tool when you need to: 1) Find slow or expensive queries, 2) Analyze query performance patterns, 3) Optimize database workload, 4) Track query statistics over time. The tool helps identify opportunities for performance optimization.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose query statistics to analyze. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |
| `num` | `number` *optional* | The number of queries to display. Defaults to 10. |
| `reset` | `boolean` *optional* | When true, resets statistics gathered by pg_stat_statements. |
| `truncate` | `boolean` *optional* | When true, truncates queries to 40 characters. |

### Tool: **`pg_ps`**

Monitor active database queries and processes. Use this tool when you need to: 1) View currently executing queries, 2) Track query progress and resource usage, 3) Identify long-running or blocked queries, 4) Debug performance issues in real-time. The tool provides detailed visibility into database activity with optional verbose output.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose database processes to view. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |
| `verbose` | `boolean` *optional* | When true, shows additional query details including query plan and memory usage. |

### Tool: **`pg_psql`**

Execute SQL queries against Heroku PostgreSQL databases. Use this tool when you need to: 1) Run SQL queries for database analysis, 2) Investigate database locks and performance, 3) Make schema modifications or updates, 4) Execute complex database operations. The tool provides direct SQL access with support for file-based queries and credential management.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | app to run command against |
| `command` | `string` *optional* | SQL command to run; file is ignored if provided; must be single line; must supply either command or file |
| `credential` | `string` *optional* | credential to use |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |
| `file` | `string` *optional* | SQL file to run; command is ignored if provided; must be an absolute path; must supply either command or file |

### Tool: **`pg_upgrade`**

Upgrade PostgreSQL database version. Use this tool when you need to: 1) Migrate to a newer PostgreSQL version, 2) Plan version upgrade paths, 3) Execute controlled version migrations, 4) Verify upgrade compatibility. The tool manages safe database version upgrades with confirmation protection.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app whose database to upgrade. |
| `confirm` | `string` *optional* | Confirmation string required for this potentially destructive operation. |
| `database` | `string` *optional* | Config var containing the connection string, unique name, ID, or alias of the database. To access another app's database, prepend the app name to the config var or alias with `APP_NAME::`. If omitted, DATABASE_URL is used. |
| `version` | `string` *optional* | PostgreSQL version to upgrade to |

### Tool: **`pipelines_create`**

Create new Heroku deployment pipelines. Use this tool when you need to: 1) Set up new deployment workflows, 2) Create staged application environments, 3) Organize apps by development stages, 4) Configure team-based pipeline structures. The tool manages pipeline creation with optional team and initial app configuration.

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Name of the pipeline to create |
| `stage` | `string` | Stage of first app in pipeline (e.g., production, staging, development) |
| `app` | `string` *optional* | Name of the app to add to the pipeline |
| `team` | `string` *optional* | Team to create the pipeline in |

### Tool: **`pipelines_info`**

Display detailed pipeline configuration. Use this tool when you need to: 1) View pipeline stage configuration, 2) Check connected applications, 3) Verify pipeline settings, 4) Monitor pipeline status. The tool provides comprehensive pipeline information and structure details.

| Parameter | Type | Description |
| - | - | - |
| `pipeline` | `string` | Name of the pipeline to get info for |
| `json` | `boolean` *optional* | Output in json format |

### Tool: **`pipelines_list`**

View available Heroku pipelines. Use this tool when you need to: 1) List accessible pipelines, 2) Check pipeline ownership and access, 3) View pipeline organization, 4) Find specific pipeline configurations. The tool provides pipeline visibility with optional JSON output format.

| Parameter | Type | Description |
| - | - | - |
| `json` | `boolean` *optional* | Output in json format |

### Tool: **`pipelines_promote`**

Promote applications through pipeline stages. Use this tool when you need to: 1) Deploy code to staging or production environments, 2) Manage staged releases, 3) Coordinate multi-app promotions, 4) Control deployment workflows. The tool handles safe promotion of apps between pipeline stages.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | Name of the app to promote from |
| `to` | `string` *optional* | comma separated list of apps to promote to |

### Tool: **`ps_list`**

List and monitor Heroku application dynos. Use this tool when you need to: 1) View all running dynos for an app, 2) Check dyno status and health, 3) Monitor application process states, 4) Verify dyno configurations. The tool provides process visibility with optional JSON output format.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | Name of the app to list processes for |
| `json` | `boolean` *optional* | Return process information in json format |

### Tool: **`ps_restart`**

Restart Heroku application processes. Use this tool when you need to: 1) Restart specific dynos by name, 2) Restart all dynos of a process type, 3) Perform full application restarts, 4) Reset dyno states selectively. The tool manages process restarts with flexible targeting options.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | Name of the app to restart processes for |
| `dyno-name` | `string` *optional* | Specific dyno to restart (e.g., web.1). If neither dyno-name nor process-type specified, restarts all dynos |
| `process-type` | `string` *optional* | Type of dynos to restart (e.g., web). If neither dyno-name nor process-type specified, restarts all dynos |

### Tool: **`ps_scale`**

Scale and resize Heroku application dynos. Use this tool when you need to: 1) Adjust dyno quantities up or down, 2) Change dyno sizes for performance, 3) View current formation details, 4) Manage resource allocation. The tool handles dyno scaling with support for type-specific adjustments.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | Name of the app to scale |
| `dyno` | `string` *optional* | The type and quantity of dynos to scale (e.g., web=3:Standard-2X, worker+1). Omit to display current formation. |

### Tool: **`rename_app`**

Rename an existing Heroku application. Use this tool when a user needs to: 1) Change an app's name, or 2) Resolve naming conflicts. Requires both current app name and desired new name. The tool validates name availability and handles the rename process.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The current name of the Heroku app you want to rename. This must be an existing app that you have access to. |
| `newName` | `string` | The new name you want to give to the app. Must be unique across all Heroku apps. |

### Tool: **`transfer_app`**

Transfer ownership of a Heroku application. Use this tool when a user wants to: 1) Transfer an app to another user's account, 2) Move an app to a team, 3) Change app ownership for organizational purposes. Requires the app name and recipient (email for users, name for teams). The current user must be the app owner or a team admin to perform the transfer.

| Parameter | Type | Description |
| - | - | - |
| `app` | `string` | The name of the Heroku app you want to transfer ownership of. You must be the current owner of this app or a team admin to transfer it. |
| `recipient` | `string` | The email address of the user or the name of the team who will receive ownership of the app. The recipient must have a Heroku account. |

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
        "-e"
        "HEROKU_API_KEY"
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

## Rebuild this image

```console
docker build -t mcp/heroku -f Dockerfile https://github.com/heroku/heroku-mcp-server.git#refs/pull/24/merge
```

