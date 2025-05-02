# Redis MCP Server

Access to Redis database operations.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/redis](https://hub.docker.com/repository/docker/mcp/redis)
**Author**|[redis](https://github.com/redis)
**Repository**|https://github.com/redis/mcp-redis
**Dockerfile**|https://github.com/redis/mcp-redis/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/redis)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/redis --key https://registry.scout.docker.com/keyring/dhi/latest`
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`client_list`|Get a list of connected clients to the Redis server.|
`create_vector_index_hash`|Create a Redis 8 vector similarity index using HNSW on a Redis hash.|
`dbsize`|Get the number of keys stored in the Redis database|
`delete`|Delete a Redis key.|
`expire`|Set an expiration time for a Redis key.|
`get`|Get a Redis string value.|
`get_index_info`|Retrieve schema and information about a specific Redis index using FT.INFO.|
`get_indexed_keys_number`|Retrieve the number of indexed keys by the index|
`get_indexes`|List of indexes in the Redis database|
`get_vector_from_hash`|Retrieve a vector from a Redis hash and convert it back from binary blob.|
`hdel`|Delete a field from a Redis hash.|
`hexists`|Check if a field exists in a Redis hash.|
`hget`|Get the value of a field in a Redis hash.|
`hgetall`|Get all fields and values from a Redis hash.|
`hset`|Set a field in a hash stored at key with an optional expiration time.|
`info`|Get Redis server information and statistics.|
`json_del`|Delete a JSON value from Redis at a given path.|
`json_get`|Retrieve a JSON value from Redis at a given path.|
`json_set`|Set a JSON value in Redis at a given path with an optional expiration time.|
`llen`|Get the length of a Redis list.|
`lpop`|Remove and return the first element from a Redis list.|
`lpush`|Push a value onto the left of a Redis list and optionally set an expiration time.|
`lrange`|Get elements from a Redis list within a specific range.|
`publish`|Publish a message to a Redis channel.|
`rename`|Renames a Redis key from old_key to new_key.|
`rpop`|Remove and return the last element from a Redis list.|
`rpush`|Push a value onto the right of a Redis list and optionally set an expiration time.|
`sadd`|Add a value to a Redis set with an optional expiration time.|
`set`|Set a Redis string value with an optional expiration time.|
`set_vector_in_hash`|Store a vector as a field in a Redis hash.|
`smembers`|Get all members of a Redis set.|
`srem`|Remove a value from a Redis set.|
`subscribe`|Subscribe to a Redis channel.|
`type`|Returns the string representation of the type of the value stored at key|
`unsubscribe`|Unsubscribe from a Redis channel.|
`vector_search_hash`|Perform a KNN vector similarity search using Redis 8 or later version on vectors stored in hash data structures.|
`xadd`|Add an entry to a Redis stream with an optional expiration time.|
`xdel`|Delete an entry from a Redis stream.|
`xrange`|Read entries from a Redis stream.|
`zadd`|Add a member to a Redis sorted set with an optional expiration time.|
`zrange`|Retrieve a range of members from a Redis sorted set.|
`zrem`|Remove a member from a Redis sorted set.|

---
## Tools Details

#### Tool: **`client_list`**
Get a list of connected clients to the Redis server.
#### Tool: **`create_vector_index_hash`**
Create a Redis 8 vector similarity index using HNSW on a Redis hash.

This function sets up a Redis index for approximate nearest neighbor (ANN)
search using the HNSW algorithm and float32 vector embeddings.
Parameters|Type|Description
-|-|-
`dim`|`integer` *optional*|The dimensionality of the vectors stored under the vector_field.
`distance_metric`|`string` *optional*|The distance function to use (e.g., 'COSINE', 'L2', 'IP').
`index_name`|`string` *optional*|The name of the Redis index to create. Unless specifically required, use the default name for the index.
`prefix`|`string` *optional*|The key prefix used to identify documents to index (e.g., 'doc:'). Unless specifically required, use the default prefix.
`vector_field`|`string` *optional*|The name of the vector field to be indexed for similarity search. Unless specifically required, use the default field name

---
#### Tool: **`dbsize`**
Get the number of keys stored in the Redis database
#### Tool: **`delete`**
Delete a Redis key.
Parameters|Type|Description
-|-|-
`key`|`string`|

---
#### Tool: **`expire`**
Set an expiration time for a Redis key.
Parameters|Type|Description
-|-|-
`expire_seconds`|`integer`|Time in seconds after which the key should expire.
`name`|`string`|The Redis key.

---
#### Tool: **`get`**
Get a Redis string value.
Parameters|Type|Description
-|-|-
`key`|`string`|

---
#### Tool: **`get_index_info`**
Retrieve schema and information about a specific Redis index using FT.INFO.
Parameters|Type|Description
-|-|-
`index_name`|`string`|

---
#### Tool: **`get_indexed_keys_number`**
Retrieve the number of indexed keys by the index
Parameters|Type|Description
-|-|-
`index_name`|`string`|

---
#### Tool: **`get_indexes`**
List of indexes in the Redis database
#### Tool: **`get_vector_from_hash`**
Retrieve a vector from a Redis hash and convert it back from binary blob.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis hash key.
`vector_field`|`string` *optional*|The field name inside the hash. Unless specifically required, use the default field name

---
#### Tool: **`hdel`**
Delete a field from a Redis hash.
Parameters|Type|Description
-|-|-
`key`|`string`|The field name inside the hash.
`name`|`string`|The Redis hash key.

---
#### Tool: **`hexists`**
Check if a field exists in a Redis hash.
Parameters|Type|Description
-|-|-
`key`|`string`|The field name inside the hash.
`name`|`string`|The Redis hash key.

---
#### Tool: **`hget`**
Get the value of a field in a Redis hash.
Parameters|Type|Description
-|-|-
`key`|`string`|The field name inside the hash.
`name`|`string`|The Redis hash key.

---
#### Tool: **`hgetall`**
Get all fields and values from a Redis hash.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis hash key.

---
#### Tool: **`hset`**
Set a field in a hash stored at key with an optional expiration time.
Parameters|Type|Description
-|-|-
`key`|`string`|The field name inside the hash.
`name`|`string`|The Redis hash key.
`value`|`string`|The value to set.
`expire_seconds`|`integer` *optional*|Optional; time in seconds after which the key should expire.

---
#### Tool: **`info`**
Get Redis server information and statistics.
Parameters|Type|Description
-|-|-
`section`|`string` *optional*|The section of the info command (default, memory, cpu, etc.).

---
#### Tool: **`json_del`**
Delete a JSON value from Redis at a given path.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis key where the JSON document is stored.
`path`|`string` *optional*|The JSON path to delete (default: root '$').

---
#### Tool: **`json_get`**
Retrieve a JSON value from Redis at a given path.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis key where the JSON document is stored.
`path`|`string` *optional*|The JSON path to retrieve (default: root '$').

---
#### Tool: **`json_set`**
Set a JSON value in Redis at a given path with an optional expiration time.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis key where the JSON document is stored.
`path`|`string`|The JSON path where the value should be set.
`value`|`string`|The JSON value to store.
`expire_seconds`|`integer` *optional*|Optional; time in seconds after which the key should expire.

---
#### Tool: **`llen`**
Get the length of a Redis list.
Parameters|Type|Description
-|-|-
`name`|`string`|

---
#### Tool: **`lpop`**
Remove and return the first element from a Redis list.
Parameters|Type|Description
-|-|-
`name`|`string`|

---
#### Tool: **`lpush`**
Push a value onto the left of a Redis list and optionally set an expiration time.
Parameters|Type|Description
-|-|-
`name`|`string`|
`value`|`string`|
`expire`|`integer` *optional*|

---
#### Tool: **`lrange`**
Get elements from a Redis list within a specific range.
Parameters|Type|Description
-|-|-
`name`|`string`|
`start`|`integer`|
`stop`|`integer`|

---
#### Tool: **`publish`**
Publish a message to a Redis channel.
Parameters|Type|Description
-|-|-
`channel`|`string`|The Redis channel to publish to.
`message`|`string`|The message to send.

---
#### Tool: **`rename`**
Renames a Redis key from old_key to new_key.
Parameters|Type|Description
-|-|-
`new_key`|`string`|
`old_key`|`string`|

---
#### Tool: **`rpop`**
Remove and return the last element from a Redis list.
Parameters|Type|Description
-|-|-
`name`|`string`|

---
#### Tool: **`rpush`**
Push a value onto the right of a Redis list and optionally set an expiration time.
Parameters|Type|Description
-|-|-
`name`|`string`|
`value`|`string`|
`expire`|`integer` *optional*|

---
#### Tool: **`sadd`**
Add a value to a Redis set with an optional expiration time.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis set key.
`value`|`string`|The value to add to the set.
`expire_seconds`|`integer` *optional*|Optional; time in seconds after which the set should expire.

---
#### Tool: **`set`**
Set a Redis string value with an optional expiration time.
Parameters|Type|Description
-|-|-
`key`|`string`|
`value`|`string`|
`expiration`|`integer` *optional*|

---
#### Tool: **`set_vector_in_hash`**
Store a vector as a field in a Redis hash.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis hash key.
`vector`|`array`|The vector (list of numbers) to store in the hash.
`vector_field`|`string` *optional*|The field name inside the hash. Unless specifically required, use the default field name

---
#### Tool: **`smembers`**
Get all members of a Redis set.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis set key.

---
#### Tool: **`srem`**
Remove a value from a Redis set.
Parameters|Type|Description
-|-|-
`name`|`string`|The Redis set key.
`value`|`string`|The value to remove from the set.

---
#### Tool: **`subscribe`**
Subscribe to a Redis channel.
Parameters|Type|Description
-|-|-
`channel`|`string`|The Redis channel to subscribe to.

---
#### Tool: **`type`**
Returns the string representation of the type of the value stored at key
Parameters|Type|Description
-|-|-
`key`|`string`|

---
#### Tool: **`unsubscribe`**
Unsubscribe from a Redis channel.
Parameters|Type|Description
-|-|-
`channel`|`string`|The Redis channel to unsubscribe from.

---
#### Tool: **`vector_search_hash`**
Perform a KNN vector similarity search using Redis 8 or later version on vectors stored in hash data structures.
Parameters|Type|Description
-|-|-
`query_vector`|`array`|List of floats to use as the query vector.
`index_name`|`string` *optional*|Name of the Redis index. Unless specifically specified, use the default index name.
`k`|`integer` *optional*|Number of nearest neighbors to return.
`return_fields`|`array` *optional*|List of fields to return (optional).
`vector_field`|`string` *optional*|Name of the indexed vector field. Unless specifically required, use the default field name

---
#### Tool: **`xadd`**
Add an entry to a Redis stream with an optional expiration time.
Parameters|Type|Description
-|-|-
`fields`|`object`|
`key`|`string`|
`expiration`|`integer` *optional*|

---
#### Tool: **`xdel`**
Delete an entry from a Redis stream.
Parameters|Type|Description
-|-|-
`entry_id`|`string`|
`key`|`string`|

---
#### Tool: **`xrange`**
Read entries from a Redis stream.
Parameters|Type|Description
-|-|-
`key`|`string`|
`count`|`integer` *optional*|

---
#### Tool: **`zadd`**
Add a member to a Redis sorted set with an optional expiration time.
Parameters|Type|Description
-|-|-
`key`|`string`|
`member`|`string`|
`score`|`number`|
`expiration`|`integer` *optional*|

---
#### Tool: **`zrange`**
Retrieve a range of members from a Redis sorted set.
Parameters|Type|Description
-|-|-
`end`|`integer`|
`key`|`string`|
`start`|`integer`|
`with_scores`|`boolean` *optional*|

---
#### Tool: **`zrem`**
Remove a member from a Redis sorted set.
Parameters|Type|Description
-|-|-
`key`|`string`|
`member`|`string`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "redis": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "REDIS_HOST",
        "-e",
        "REDIS_PORT",
        "-e",
        "REDIS_USERNAME",
        "-e",
        "REDIS_SSL",
        "-e",
        "REDIS_CA_PATH",
        "-e",
        "REDIS_SSL_KEYFILE",
        "-e",
        "REDIS_SSL_CERTFILE",
        "-e",
        "REDIS_CERT_REQS",
        "-e",
        "REDIS_CA_CERTS",
        "-e",
        "REDIS_CLUSTER_MODE",
        "-e",
        "REDIS_PWD",
        "mcp/redis"
      ],
      "env": {
        "REDIS_HOST": "127.0.0.1",
        "REDIS_PORT": "6379",
        "REDIS_USERNAME": "default",
        "REDIS_SSL": "False",
        "REDIS_CA_PATH": "",
        "REDIS_SSL_KEYFILE": "",
        "REDIS_SSL_CERTFILE": "",
        "REDIS_CERT_REQS": "required",
        "REDIS_CA_CERTS": "",
        "REDIS_CLUSTER_MODE": "False",
        "REDIS_PWD": ""
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
