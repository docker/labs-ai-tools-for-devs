# Redis Cloud MCP Server

MCP Server for Redis Cloud's API, allowing you to manage your Redis Cloud resources using natural language.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/redis-cloud](https://hub.docker.com/repository/docker/mcp/redis-cloud)
**Author**|[redis](https://github.com/redis)
**Repository**|https://github.com/redis/mcp-redis-cloud
**Dockerfile**|https://github.com/redis/mcp-redis-cloud/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/redis-cloud)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/redis-cloud --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create-essential-database`|Create a new essential database inside the specified subscription ID.|
`create-essential-subscription`|Create a new essential subscription.|
`create-pro-database`|Create a new database inside the specified subscription ID.|
`create-pro-subscription`|Create a new pro subscription.|
`delete-essential-subscription`|Delete an essential subscription by ID|
`get-current-account`|Get the current Cloud Redis account|
`get-current-payment-methods`|Get the current payment methods for the current Cloud Redis account|
`get-database-modules`|Lookup list of database modules supported in current account (support may differ based on subscription and database settings).|
`get-essential-databases`|Get the essential databases for the provided subscription Id|
`get-essential-subscription-by-id`|Get an essential subscription by ID for the current Cloud Redis account|
`get-essential-subscriptions`|Get the essential subscriptions for the current Cloud Redis account.|
`get-essentials-plans`|Get the available plans for essential subscriptions.|
`get-pro-databases`|Get the pro databases for the provided subscription Id|
`get-pro-plans-regions`|Lookup list of regions for cloud provider.|
`get-pro-subscription`|Get pro subscription by ID.|
`get-pro-subscriptions`|Get the pro subscriptions for the current Cloud Redis account|
`get-task-by-id`|Get a task by ID for the current Cloud Redis account|
`get-tasks`|Get the current tasks for the current Cloud Redis account|

---
## Tools Details

#### Tool: **`create-essential-database`**
Create a new essential database inside the specified subscription ID. Returns a TASK ID that can be used to track the status of the database creation. IMPORTANT GUIDELINES: 1) DO NOT set optional parameters unless explicitly requested. 2) Modules can only be selected if protocol is 'redis'. 3) When creating a free database, first call the get-essential-subscriptions tool to check if a free database already exists (each account is limited to one free database). 4) For database modules, validate against get-database-modules list. 5) The payload must match the input schema.
Parameters|Type|Description
-|-|-
`name`|`string`|Required. Name of the database. Database name is limited to 40 characters or less and must include only letters, digits, and hyphens ('-'). It must start with a letter and end with a letter or digit.
`subscriptionId`|`number`|Subscription ID
`dataEvictionPolicy`|`string` *optional*|Optional. Data items eviction method. Default: 'volatile-lru'
`dataPersistence`|`string` *optional*|Optional. Rate of database data persistence (in persistent storage). The default is according to the subscription plan.
`datasetSizeInGb`|`number` *optional*|Optional. The maximum amount of data in the dataset for this specific database is in GB. If 'replication' is true, the database's total memory will be twice as large as the datasetSizeInGb. If 'replication' is false, the database's total memory will be the datasetSizeInGb value.
`enableDatabaseClustering`|`boolean` *optional*|Optional. Distributes database data to different cloud instances. Supported only for 'Pay-As-You-Go' subscriptions.
`enableTls`|`boolean` *optional*|Optional. When 'true', requires TLS authentication for all connections (mTLS with valid clientTlsCertificates, regular TLS when the clientTlsCertificates is not provided. Default: 'false'
`modules`|`array` *optional*|Optional. Redis modules to be provisioned in the database. Use get-database-modules to retrieve available modules and configure the desired ones. IMPORTANT: Modules can only be used when protocol is 'redis'. Cannot use modules with 'memcached' or 'stack' protocols.
`numberOfShards`|`integer` *optional*|Optional. Specifies the number of master shards. Supported only for 'Pay-As-You-Go' subscriptions.
`password`|`string` *optional*|Optional. Password to access the database. If omitted, a random 32 character long alphanumeric password will be automatically generated. Can only be set if Database Protocol is REDIS
`periodicBackupPath`|`string` *optional*|Optional. If specified, automatic backups will be every 24 hours or database will be able to perform immediate backups to this path. If empty string is received, backup path will be removed.
`protocol`|`string` *optional*|Optional. Database protocol. Default: 'redis' for Pay-As-You-Go subscriptions, 'stack' for Redis Flex subscriptions
`replication`|`boolean` *optional*|Optional. Databases replication. The default is according to the subscription plan.
`respVersion`|`string` *optional*|Optional. RESP version must be compatible with Redis version.
`sourceIps`|`array` *optional*|Optional. List of source IP addresses or subnet masks. If specified, Redis clients will be able to connect to this database only from within the specified source IP addresses ranges.
`supportOSSClusterApi`|`boolean` *optional*|Optional. Support Redis open-source (OSS) Cluster API. Supported only for 'Pay-As-You-Go' subscriptions. Default: 'false'
`useExternalEndpointForOSSClusterApi`|`boolean` *optional*|Optional. Should use external endpoint for open-source (OSS) Cluster API. Can only be enabled if OSS Cluster API support is enabled. Supported only for 'Pay-As-You-Go' subscriptions.

---
#### Tool: **`create-essential-subscription`**
Create a new essential subscription. Returns a TASK ID that can be used to track the status of the subscription creation
Parameters|Type|Description
-|-|-
`name`|`string`|Subscription name
`planId`|`number`|Plan ID. The plan ID can be taken from /fixed/plans
`paymentMethod`|`string` *optional*|Payment method
`paymentMethodId`|`number` *optional*|Payment method ID

---
#### Tool: **`create-pro-database`**
Create a new database inside the specified subscription ID. Returns a TASK ID that can be used to track the status of the database creationPrerequisites: 1) For database modules, validate against get-database-modules list. 2) Validate regions using get-pro-plans-regions. The payload must match the input schema.
Parameters|Type|Description
-|-|-
`name`|`string`|Required. Name of the database. Database name is limited to 40 characters or less and must include only letters, digits, and hyphens ('-'). It must start with a letter and end with a letter or digit.
`subscriptionId`|`number`|Subscription ID
`averageItemSizeInBytes`|`integer` *optional*|Optional. Relevant only to ram-and-flash subscriptions. Estimated average size (measured in bytes) of the items stored in the database, Default: 1000
`dataEvictionPolicy`|`string` *optional*|Optional. Data items eviction method. Default: 'volatile-lru'
`dataPersistence`|`string` *optional*|Optional. Rate of database data persistence (in persistent storage). Default: 'none'
`datasetSizeInGb`|`number` *optional*|Optional. The maximum amount of data in the dataset for this specific database is in GB. You can not set both datasetSizeInGb and totalMemoryInGb. if 'replication' is true, the database's total memory will be twice as large as the datasetSizeInGb.if 'replication' is false, the database's total memory of the database will be the datasetSizeInGb value.
`dryRun`|`boolean` *optional*|Optional. When 'false': Creates a deployment plan and deploys it (creating any resources required by the plan). When 'true': creates a read-only deployment plan without any resource creation. Default: 'true'
`enableTls`|`boolean` *optional*|Optional. When 'true', requires TLS authentication for all connections (mTLS with valid clientSslCertificate, regular TLS when the clientSslCertificate is not provided. Default: 'false'
`modules`|`array` *optional*|Optional. Redis modules to be provisioned in the database.  Use get-database-modules to retrieve available modules and configure the desired ones
`password`|`string` *optional*|Optional. Password to access the database. If omitted, a random 32 character long alphanumeric password will be automatically generated. Can only be set if Database Protocol is REDIS
`port`|`integer` *optional*|Optional. TCP port on which the database is available (10000-19999). Generated automatically if omitted
`protocol`|`string` *optional*|Optional. Database protocol. Default: 'redis'
`queryPerformanceFactor`|`string` *optional*|Optional. The query performance factor adds extra compute power specifically for search and query.
`replication`|`boolean` *optional*|Optional. Databases replication. Default: 'true'
`respVersion`|`string` *optional*|Optional. RESP version must be compatible with Redis version.
`saslPassword`|`string` *optional*|Optional. Memcached (SASL) Password to access the database. If omitted, a random 32 character long alphanumeric password will be automatically generated. Can only be set if Database Protocol is MEMCACHED
`saslUsername`|`string` *optional*|Optional. Memcached (SASL) Username to access the database. If omitted, the username will be set to a 'mc-' prefix followed by a random 5 character long alphanumeric. Can only be set if Database Protocol is MEMCACHED
`shardingType`|`string` *optional*|Optional. Database Hashing policy.
`sourceIp`|`array` *optional*|Optional. List of source IP addresses or subnet masks. If specified, Redis clients will be able to connect to this database only from within the specified source IP addresses ranges.
`supportOSSClusterApi`|`boolean` *optional*|Optional. Support Redis open-source (OSS) Cluster API. Default: 'false'
`throughputMeasurement`|`object` *optional*|Optional. Throughput measurement method.

---
#### Tool: **`create-pro-subscription`**
Create a new pro subscription. Returns a TASK ID that can be used to track the status of the subscription creation. Prerequisites: 1) Verify payment method by checking get-current-payment-methods. 2) For database modules, validate against get-database-modules list. 3) Validate regions using get-pro-plans-regions. The payload must match the input schema.
Parameters|Type|Description
-|-|-
`cloudProviders`|`array`|Required. Cloud hosting & networking details.  Make sure to validate this before submitting the subscription.
`databases`|`array`|Required. Databases specifications for each planned database. Make sure to validate this before submitting the subscription.
`deploymentType`|`string` *optional*|Optional. When 'single-region' or null: Creates a single region subscription. When 'active-active': creates an active-active (multi-region) subscription
`dryRun`|`boolean` *optional*|Optional. When 'false': Creates a deployment plan and deploys it (creating any resources required by the plan). When 'true': creates a read-only deployment plan without any resource creation. Default: 'false'
`memoryStorage`|`string` *optional*|Optional. Memory storage preference: either 'ram' or a combination of 'ram-and-flash'. Default: 'ram'
`name`|`string` *optional*|Optional. Subscription name
`paymentMethod`|`string` *optional*|Required. The payment method for the requested subscription. If 'credit-card' is specified, 'paymentMethodId' must be defined. Default: 'credit-card. Validate this before submitting the subscription.
`paymentMethodId`|`integer` *optional*|Required if paymentMethod is credit-card. A valid payment method that was pre-defined in the current account. This value is Optional if 'paymentMethod' is 'marketplace', but Required for all other account types. Validate this before submitting the subscription.
`redisVersion`|`string` *optional*|Optional. If specified, the redisVersion defines the Redis version of the databases in the subscription. If omitted, the Redis version will be the default

---
#### Tool: **`delete-essential-subscription`**
Delete an essential subscription by ID
Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID

---
#### Tool: **`get-current-account`**
Get the current Cloud Redis account
#### Tool: **`get-current-payment-methods`**
Get the current payment methods for the current Cloud Redis account
#### Tool: **`get-database-modules`**
Lookup list of database modules supported in current account (support may differ based on subscription and database settings). These modules are also called capabilities.
#### Tool: **`get-essential-databases`**
Get the essential databases for the provided subscription Id
Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID
`limit`|`number` *optional*|Optional. Maximum number of items to return
`offset`|`number` *optional*|Optional. Number of items to skip

---
#### Tool: **`get-essential-subscription-by-id`**
Get an essential subscription by ID for the current Cloud Redis account
Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID

---
#### Tool: **`get-essential-subscriptions`**
Get the essential subscriptions for the current Cloud Redis account. A paginated response is returned, and to get all the essential subscriptions, the page and size parameters must be used until all the essential subscriptions are retrieved.
Parameters|Type|Description
-|-|-
`page`|`number` *optional*|Page number
`size`|`number` *optional*|Page size

---
#### Tool: **`get-essentials-plans`**
Get the available plans for essential subscriptions. Always ask for which provider the plans are want to be retrieved. A paginated response is returned, and to get all the plans, the page and size parameters must be used until all the plans are retrieved.
Parameters|Type|Description
-|-|-
`provider`|`string`|Provider name.
`page`|`number` *optional*|Page number
`redisFlex`|`boolean` *optional*|Redis Flex
`size`|`number` *optional*|Page size

---
#### Tool: **`get-pro-databases`**
Get the pro databases for the provided subscription Id
Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID
`limit`|`number` *optional*|Optional. Maximum number of items to return
`offset`|`number` *optional*|Optional. Number of items to skip

---
#### Tool: **`get-pro-plans-regions`**
Lookup list of regions for cloud provider. These regions include the providers too.
#### Tool: **`get-pro-subscription`**
Get pro subscription by ID. The payload must match the input schema.
Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID

---
#### Tool: **`get-pro-subscriptions`**
Get the pro subscriptions for the current Cloud Redis account
#### Tool: **`get-task-by-id`**
Get a task by ID for the current Cloud Redis account
Parameters|Type|Description
-|-|-
`taskId`|`string`|Task ID

---
#### Tool: **`get-tasks`**
Get the current tasks for the current Cloud Redis account
## Use this MCP Server

```json
{
  "mcpServers": {
    "redis-cloud": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "API_KEY",
        "-e",
        "SECRET_KEY",
        "mcp/redis-cloud"
      ],
      "env": {
        "API_KEY": "<redis_cloud_api_key>",
        "SECRET_KEY": "<redis_cloud_api_secret_key>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
