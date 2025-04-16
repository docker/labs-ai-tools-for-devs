# Redis-cloud MCP Server

MCP Server for Redis Cloud's API, allowing you to manage your Redis Cloud resources using natural language.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[redis](https://github.com/redis)
**Repository**|https://github.com/redis/mcp-redis-cloud
**Dockerfile**|https://github.com/redis/mcp-redis-cloud/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create-essential-subscription`|Create a new essential subscription.|
`create-pro-database`|Create a new database inside the specified subscription ID.|
`create-pro-subscription`|Create a new pro subscription.|
`delete-essential-subscription`|Delete an essential subscription by ID|
`get-current-account`|Get the current Cloud Redis account|
`get-current-payment-methods`|Get the current payment methods for the current Cloud Redis account|
`get-database-modules`|Lookup list of database modules supported in current account (support may differ based on subscription and database settings).|
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

#### Tool: `create-essential-subscription`
|Description|
|-|
|Create a new essential subscription. Returns a TASK ID that can be used to track the status of the subscription creation|

Parameters|Type|Description
-|-|-
`name`|`string`|Subscription name
`planId`|`number`|Plan ID. The plan ID can be taken from /fixed/plans
`paymentMethod`|`string` *optional*|Payment method
`paymentMethodId`|`number` *optional*|Payment method ID

---
#### Tool: `create-pro-database`
|Description|
|-|
|Create a new database inside the specified subscription ID. Returns a TASK ID that can be used to track the status of the database creationPrerequisites: 1) For database modules, validate against get-database-modules list. 2) Validate regions using get-pro-plans-regions. The payload must match the input schema.|

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
#### Tool: `create-pro-subscription`
|Description|
|-|
|Create a new pro subscription. Returns a TASK ID that can be used to track the status of the subscription creation. Prerequisites: 1) Verify payment method by checking get-current-payment-methods. 2) For database modules, validate against get-database-modules list. 3) Validate regions using get-pro-plans-regions. The payload must match the input schema.|

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
#### Tool: `delete-essential-subscription`
|Description|
|-|
|Delete an essential subscription by ID|

Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID

---
#### Tool: `get-current-account`
|Description|
|-|
|Get the current Cloud Redis account|

#### Tool: `get-current-payment-methods`
|Description|
|-|
|Get the current payment methods for the current Cloud Redis account|

#### Tool: `get-database-modules`
|Description|
|-|
|Lookup list of database modules supported in current account (support may differ based on subscription and database settings). These modules are also called capabilities.|

#### Tool: `get-essential-subscription-by-id`
|Description|
|-|
|Get an essential subscription by ID for the current Cloud Redis account|

Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID

---
#### Tool: `get-essential-subscriptions`
|Description|
|-|
|Get the essential subscriptions for the current Cloud Redis account. A paginated response is returned, and to get all the essential subscriptions, the page and size parameters must be used until all the essential subscriptions are retrieved.|

Parameters|Type|Description
-|-|-
`page`|`number` *optional*|Page number
`size`|`number` *optional*|Page size

---
#### Tool: `get-essentials-plans`
|Description|
|-|
|Get the available plans for essential subscriptions. Always ask for which provider the plans are want to be retrieved. A paginated response is returned, and to get all the plans, the page and size parameters must be used until all the plans are retrieved.|

Parameters|Type|Description
-|-|-
`provider`|`string`|Provider name.
`page`|`number` *optional*|Page number
`redisFlex`|`boolean` *optional*|Redis Flex
`size`|`number` *optional*|Page size

---
#### Tool: `get-pro-databases`
|Description|
|-|
|Get the pro databases for the provided subscription Id|

Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID
`limit`|`number` *optional*|Optional. Maximum number of items to return
`offset`|`number` *optional*|Optional. Number of items to skip

---
#### Tool: `get-pro-plans-regions`
|Description|
|-|
|Lookup list of regions for cloud provider. These regions include the providers too.|

#### Tool: `get-pro-subscription`
|Description|
|-|
|Get pro subscription by ID. The payload must match the input schema.|

Parameters|Type|Description
-|-|-
`subscriptionId`|`number`|Subscription ID

---
#### Tool: `get-pro-subscriptions`
|Description|
|-|
|Get the pro subscriptions for the current Cloud Redis account|

#### Tool: `get-task-by-id`
|Description|
|-|
|Get a task by ID for the current Cloud Redis account|

Parameters|Type|Description
-|-|-
`taskId`|`string`|Task ID

---
#### Tool: `get-tasks`
|Description|
|-|
|Get the current tasks for the current Cloud Redis account|

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
