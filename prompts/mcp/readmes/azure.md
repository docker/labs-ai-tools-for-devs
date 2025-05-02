# Azure MCP Server

This repository is for development of the Azure MCP Server, bringing the power of Azure to your agents.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/azure](https://hub.docker.com/repository/docker/mcp/azure)
**Author**|[Azure](https://github.com/Azure)
**Repository**|https://github.com/Azure/azure-mcp
**Dockerfile**|https://github.com/Azure/azure-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/azure)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`azmcp-appconfig-account-list`|List all App Configuration stores in a subscription.|
`azmcp-appconfig-kv-delete`|Delete a key-value pair from an App Configuration store.|
`azmcp-appconfig-kv-list`|List all key-values in an App Configuration store.|
`azmcp-appconfig-kv-lock`|Lock a key-value in an App Configuration store.|
`azmcp-appconfig-kv-set`|Set a key-value setting in an App Configuration store.|
`azmcp-appconfig-kv-show`|Show a specific key-value setting in an App Configuration store.|
`azmcp-appconfig-kv-unlock`|Unlock a key-value setting in an App Configuration store.|
`azmcp-cosmos-account-list`|List all Cosmos DB accounts in a subscription.|
`azmcp-cosmos-database-container-item-query`|Execute a SQL query against items in a Cosmos DB container.|
`azmcp-cosmos-database-container-list`|List all containers in a Cosmos DB database.|
`azmcp-cosmos-database-list`|List all databases in a Cosmos DB account.|
`azmcp-extension-az`|Your job is to answer questions about an Azure environment by executing Azure CLI commands.|
`azmcp-extension-azd`|Use this tool to always run all Azure Developer CLI (azd) commands.|
`azmcp-group-list`|List all resource groups in a subscription.|
`azmcp-monitor-log-query`|Execute a KQL query against a Log Analytics workspace.|
`azmcp-monitor-table-list`|List all tables in a Log Analytics workspace.|
`azmcp-monitor-workspace-list`|List Log Analytics workspaces in a subscription.|
`azmcp-search-index-describe`|Get the full definition of an Azure AI Search index.|
`azmcp-search-index-list`|List all indexes in an Azure AI Search service.|
`azmcp-search-index-query`|Query an Azure AI Search index.|
`azmcp-search-service-list`|List all Azure AI Search services in a subscription.|
`azmcp-storage-account-list`|List all Storage accounts in a subscription.|
`azmcp-storage-blob-container-details`|Get detailed properties of a storage container including metadata, lease status, and access level.|
`azmcp-storage-blob-container-list`|List all containers in a Storage account.|
`azmcp-storage-blob-list`|List all blobs in a Storage container.|
`azmcp-storage-table-list`|List all tables in a Storage account.|
`azmcp-subscription-list`|List all Azure subscriptions accessible to your account.|

---
## Tools Details

#### Tool: **`azmcp-appconfig-account-list`**
List all App Configuration stores in a subscription. This command retrieves and displays all App Configuration
stores available in the specified subscription. Results include store names returned as a JSON array.
Parameters|Type|Description
-|-|-
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-appconfig-kv-delete`**
Delete a key-value pair from an App Configuration store. This command removes the specified key-value pair from the store. 
If a label is specified, only the labeled version is deleted. If no label is specified, the key-value with the matching 
key and the default label will be deleted.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the App Configuration store (e.g., my-appconfig).
`key`|`string`|The name of the key to access within the App Configuration store.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`label`|`string` *optional*|The label to apply to the configuration key. Labels are used to group and organize settings.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-appconfig-kv-list`**
List all key-values in an App Configuration store. This command retrieves and displays all key-value pairs 
from the specified store. Each key-value includes its key, value, label, content type, ETag, last modified 
time, and lock status.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the App Configuration store (e.g., my-appconfig).
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`key`|`string` *optional*|Specifies the key filter, if any, to be used when retrieving key-values. The filter can be an exact match, for example a filter of "foo" would get all key-values with a key of "foo", or the filter can include a '*' character at the end of the string for wildcard searches (e.g., 'App*'). If omitted all keys will be retrieved.
`label`|`string` *optional*|Specifies the label filter, if any, to be used when retrieving key-values. The filter can be an exact match, for example a filter of "foo" would get all key-values with a label of "foo", or the filter can include a '*' character at the end of the string for wildcard searches (e.g., 'Prod*'). This filter is case-sensitive. If omitted, all labels will be retrieved.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-appconfig-kv-lock`**
Lock a key-value in an App Configuration store. This command sets a key-value to read-only mode, 
preventing any modifications to its value. You must specify an account name and key. Optionally, 
you can specify a label to lock a specific labeled version of the key-value.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the App Configuration store (e.g., my-appconfig).
`key`|`string`|The name of the key to access within the App Configuration store.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`label`|`string` *optional*|The label to apply to the configuration key. Labels are used to group and organize settings.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-appconfig-kv-set`**
Set a key-value setting in an App Configuration store. This command creates or updates a key-value setting 
with the specified value. You must specify an account name, key, and value. Optionally, you can specify a 
label otherwise the default label will be used.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the App Configuration store (e.g., my-appconfig).
`key`|`string`|The name of the key to access within the App Configuration store.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`value`|`string`|The value to set for the configuration key.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`label`|`string` *optional*|The label to apply to the configuration key. Labels are used to group and organize settings.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-appconfig-kv-show`**
Show a specific key-value setting in an App Configuration store. This command retrieves and displays the value, 
label, content type, ETag, last modified time, and lock status for a specific setting. You must specify an 
account name and key. Optionally, you can specify a label otherwise the setting with default label will be retrieved.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the App Configuration store (e.g., my-appconfig).
`key`|`string`|The name of the key to access within the App Configuration store.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`label`|`string` *optional*|The label to apply to the configuration key. Labels are used to group and organize settings.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-appconfig-kv-unlock`**
Unlock a key-value setting in an App Configuration store. This command removes the read-only mode from a 
key-value setting, allowing modifications to its value. You must specify an account name and key. Optionally, 
you can specify a label to unlock a specific labeled version of the setting, otherwise the setting with the 
default label will be unlocked.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the App Configuration store (e.g., my-appconfig).
`key`|`string`|The name of the key to access within the App Configuration store.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`label`|`string` *optional*|The label to apply to the configuration key. Labels are used to group and organize settings.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-cosmos-account-list`**
List all Cosmos DB accounts in a subscription. This command retrieves and displays all Cosmos DB accounts 
available in the specified subscription. Results include account names and are returned as a JSON array.
Parameters|Type|Description
-|-|-
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-cosmos-database-container-item-query`**
Execute a SQL query against items in a Cosmos DB container. Requires account-name, 
database-name, and container-name. 
The query parameter accepts SQL query syntax. Results are returned as a 
JSON array of documents.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the Cosmos DB account to query (e.g., my-cosmos-account).
`container-name`|`string`|The name of the container to query (e.g., my-container).
`database-name`|`string`|The name of the database to query (e.g., my-database).
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`query`|`string` *optional*|SQL query to execute against the container. Uses Cosmos DB SQL syntax.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-cosmos-database-container-list`**
List all containers in a Cosmos DB database. This command retrieves and displays all containers within 
the specified database and Cosmos DB account. Results include container names and are returned as a 
JSON array. You must specify both an account name and a database name.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the Cosmos DB account to query (e.g., my-cosmos-account).
`database-name`|`string`|The name of the database to query (e.g., my-database).
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-cosmos-database-list`**
List all databases in a Cosmos DB account. This command retrieves and displays all databases available 
in the specified Cosmos DB account. Results include database names and are returned as a JSON array.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the Cosmos DB account to query (e.g., my-cosmos-account).
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-extension-az`**
Your job is to answer questions about an Azure environment by executing Azure CLI commands. You have the following rules:

- Use the Azure CLI to manage Azure resources and services. Do not use any other tool.
- Provide a valid Azure CLI command. For example: 'group list'.
- When deleting or modifying resources, ALWAYS request user confirmation.
- If a command fails, retry 3 times before giving up with an improved version of the code based on the returned feedback.
- When listing resources, ensure pagination is handled correctly so that all resources are returned.
- You can ONLY write code that interacts with Azure. It CANNOT generate charts, tables, graphs, etc.
- You can delete or modify resources in your Azure environment. Always be cautious and include appropriate warnings when providing commands to users.
- Be concise, professional and to the point. Do not give generic advice, always reply with detailed & contextual data sourced from the current Azure environment.
Parameters|Type|Description
-|-|-
`command`|`string`|The Azure CLI command to execute (without the 'az' prefix). For example: 'group list'.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-extension-azd`**
Use this tool to always run all Azure Developer CLI (azd) commands. Most common activities will be helping users initialize projects, manage environments, provision and deploy infrastructure and apps to their Azure environment. If an azure.yaml file exists in the workspace, treat it as an existing azd project; otherwise, use init to create one. Always pass --cwd with the full workspace path, and use -e to specify the environment when required. Confirm with the user before performing destructive operations. After each command, suggest next steps if available, and ask before proceeding. On errors, prompt for missing info and retry. Be concise and contextual, using data from the user's environment and workspace to provide accurate, actionable responses. This tool can create, modify or delete resources in Azure. Always warn and confirm action with the user before performing destructive commands like 'up', 'down', 'provision' or 'deploy'.
Parameters|Type|Description
-|-|-
`command`|`string`|The Azure Developer CLI command to execute (without the 'azd' prefix). For example: 'up'.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-group-list`**
List all resource groups in a subscription. This command retrieves all resource groups available
in the specified subscription. Results include resource group names and IDs,
returned as a JSON array.
Parameters|Type|Description
-|-|-
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-monitor-log-query`**
Execute a KQL query against a Log Analytics workspace. Requires workspace 
and resource group. Optional hours 
(default: 24) and limit 
(default: 20) parameters.
The query parameter accepts KQL syntax.
Parameters|Type|Description
-|-|-
`query`|`string`|The KQL query to execute against the Log Analytics workspace. You can use predefined queries by name:
- 'recent': Shows most recent logs ordered by TimeGenerated
- 'errors': Shows error-level logs ordered by TimeGenerated
Otherwise, provide a custom KQL query.
`resource-group`|`string`|The name of the Azure resource group. This is a logical container for Azure resources.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`table-name`|`string`|The name of the table to query. This is the specific table within the workspace.
`workspace`|`string`|The Log Analytics workspace ID or name. This can be either the unique identifier (GUID) or the display name of your workspace.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`hours`|`string` *optional*|The number of hours to query back from now.
`limit`|`string` *optional*|The maximum number of results to return.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-monitor-table-list`**
List all tables in a Log Analytics workspace. Requires workspace.
Returns table names and schemas that can be used for constructing KQL queries.
Parameters|Type|Description
-|-|-
`resource-group`|`string`|The name of the Azure resource group. This is a logical container for Azure resources.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`table-type`|`string`|The type of table to query. Options: 'CustomLog', 'AzureMetrics', etc.
`workspace`|`string`|The Log Analytics workspace ID or name. This can be either the unique identifier (GUID) or the display name of your workspace.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-monitor-workspace-list`**
List Log Analytics workspaces in a subscription. This command retrieves all Log Analytics workspaces 
available in the specified Azure subscription, displaying their names, IDs, and other key properties. 
Use this command to identify workspaces before querying their logs or tables.
Parameters|Type|Description
-|-|-
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-search-index-describe`**
Get the full definition of an Azure AI Search index. Returns the complete index configuration including 
fields, analyzers, suggesters, scoring profiles, and other settings.

Required arguments:
- service-name: The name of the Azure AI Search service
- index-name: The name of the search index to retrieve
Parameters|Type|Description
-|-|-
`index-name`|`string`|The name of the search index within the Azure AI Search service.
`service-name`|`string`|The name of the Azure AI Search service (e.g., my-search-service).
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-search-index-list`**
List all indexes in an Azure AI Search service.

Required arguments:
- service-name
Parameters|Type|Description
-|-|-
`service-name`|`string`|The name of the Azure AI Search service (e.g., my-search-service).
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-search-index-query`**
Query an Azure AI Search index. Returns search results matching the specified query.

Required arguments:
- service-name: The name of the Azure AI Search service
- index-name: The name of the search index to query
- query: The search text to query with
Parameters|Type|Description
-|-|-
`index-name`|`string`|The name of the search index within the Azure AI Search service.
`query`|`string`|The search query to execute against the Azure AI Search index.
`service-name`|`string`|The name of the Azure AI Search service (e.g., my-search-service).
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-search-service-list`**
List all Azure AI Search services in a subscription.

Required arguments:
- subscription
Parameters|Type|Description
-|-|-
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-storage-account-list`**
List all Storage accounts in a subscription. This command retrieves all Storage accounts available
in the specified subscription. Results include account names and are 
returned as a JSON array.
Parameters|Type|Description
-|-|-
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-storage-blob-container-details`**
Get detailed properties of a storage container including metadata, lease status, and access level.
Requires account-name and container-name.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount').
`container-name`|`string`|The name of the container to access within the storage account.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-storage-blob-container-list`**
List all containers in a Storage account. This command retrieves and displays all containers available
in the specified account. Results include container names and are returned as a JSON array.
Requires account-name.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount').
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-storage-blob-list`**
List all blobs in a Storage container. This command retrieves and displays all blobs available
in the specified container and Storage account. Results include blob names, sizes, and content types,
returned as a JSON array. Requires account-name and 
container-name.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount').
`container-name`|`string`|The name of the container to access within the storage account.
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-storage-table-list`**
List all tables in a Storage account. This command retrieves and displays all tables available in the specified Storage account.
Results include table names and are returned as a JSON array. You must specify an account name and subscription ID.
Use this command to explore your Storage resources or to verify table existence before performing operations on specific tables.
Parameters|Type|Description
-|-|-
`account-name`|`string`|The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount').
`subscription`|`string`|The Azure subscription ID or name. This can be either the GUID identifier or the display name of the Azure subscription to use.
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
#### Tool: **`azmcp-subscription-list`**
List all Azure subscriptions accessible to your account. Optionally specify tenant
and auth-method. Results include subscription names and IDs, returned as a JSON array.
Parameters|Type|Description
-|-|-
`auth-method`|`string` *optional*|Authentication method to use. Options: 'credential' (Azure CLI/managed identity), 'key' (access key), or 'connectionString'.
`retry-delay`|`string` *optional*|Initial delay in seconds between retry attempts. For exponential backoff, this value is used as the base.
`retry-max-delay`|`string` *optional*|Maximum delay in seconds between retries, regardless of the retry strategy.
`retry-max-retries`|`string` *optional*|Maximum number of retry attempts for failed operations before giving up.
`retry-mode`|`string` *optional*|Retry strategy to use. 'fixed' uses consistent delays, 'exponential' increases delay between attempts.
`retry-network-timeout`|`string` *optional*|Network operation timeout in seconds. Operations taking longer than this will be cancelled.
`tenant`|`string` *optional*|The Azure Active Directory tenant ID or name. This can be either the GUID identifier or the display name of your Azure AD tenant.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "azure": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/azure",
        "server",
        "start"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
