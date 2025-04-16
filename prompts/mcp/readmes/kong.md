# Kong MCP Server

A Model Context Protocol (MCP) server for interacting with Kong Konnect APIs, allowing AI assistants to query and analyze Kong Gateway configurations, traffic, and analytics.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[Kong](https://github.com/Kong)
**Repository**|https://github.com/Kong/mcp-konnect
**Dockerfile**|https://github.com/Kong/mcp-konnect/blob/refs/pull/7/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`check_control_plane_group_membership`|Check if a control plane is a member of any group.|
`get_consumer_requests`|Retrieve and analyze API requests made by a specific consumer.|
`get_control_plane`|Get detailed information about a specific control plane.|
`list_consumers`|List all consumers associated with a control plane.|
`list_control_plane_group_memberships`|List all control planes that are members of a specific control plane group.|
`list_control_planes`|List all control planes in your organization.|
`list_plugins`|List all plugins associated with a control plane.|
`list_routes`|List all routes associated with a control plane.|
`list_services`|List all services associated with a control plane.|
`query_api_requests`|Query and analyze Kong API Gateway requests with customizable filters.|

---
## Tools Details

#### Tool: **`check_control_plane_group_membership`**
Check if a control plane is a member of any group.

INPUT:
  - controlPlaneId: String - ID of the control plane to check

OUTPUT:
  - controlPlaneId: String - ID of the control plane that was checked
  - groupMembership: Object - Membership information including:
    - isMember: Boolean - Whether the control plane is a member of any group
    - groupId: String - ID of the group this control plane belongs to (if any)
    - groupName: String - Name of the group this control plane belongs to
    - status: String - Membership status (OK, CONFLICT, etc.)
    - message: String - Status message
    - conflicts: Array - List of configuration conflicts if any
  - relatedTools: Array - List of related tools for group management
Parameters|Type|Description
-|-|-
`controlPlaneId`|`string`|Control plane ID to check (can be obtained from list-control-planes tool)

---
#### Tool: **`get_consumer_requests`**
Retrieve and analyze API requests made by a specific consumer.

INPUT:
  - consumerId: String - ID of the consumer to analyze. The format of this field must be "controlPlaneID:consumerId".
  - timeRange: String - Time range for data retrieval (15M, 1H, 6H, 12H, 24H, 7D)
  - successOnly: Boolean - Filter to only show successful (2xx) requests (default: false)
  - failureOnly: Boolean - Filter to only show failed (non-2xx) requests (default: false)
  - maxResults: Number - Maximum number of results to return (1-1000)

OUTPUT:
  - metadata: Object - Contains consumerId, totalRequests, timeRange, and filters
  - statistics: Object - Usage statistics including:
    - averageLatencyMs: Number - Average response time in milliseconds
    - successRate: Number - Percentage of successful requests
    - statusCodeDistribution: Array - Breakdown of requests by status code
    - serviceDistribution: Array - Breakdown of requests by service
  - requests: Array - List of requests with details for each request
Parameters|Type|Description
-|-|-
`consumerId`|`string`|Consumer ID to filter by (obtainable from analyze-failed-requests or query-api-requests tools)
`failureOnly`|`boolean` *optional*|Show only failed (non-2xx) requests
`maxResults`|`integer` *optional*|Number of items to return per page
`successOnly`|`boolean` *optional*|Show only successful (2xx) requests
`timeRange`|`string` *optional*|Time range for data retrieval (15M = 15 minutes, 1H = 1 hour, etc.)

---
#### Tool: **`get_control_plane`**
Get detailed information about a specific control plane.

INPUT:
  - controlPlaneId: String - ID of the control plane to retrieve

OUTPUT:
  - controlPlaneDetails: Object - Detailed information including:
    - controlPlaneId: String - Unique identifier for the control plane
    - name: String - Display name of the control plane
    - description: String - Description of the control plane
    - type: String - Type of the control plane
    - clusterType: String - Underlying cluster type
    - controlPlaneEndpoint: String - URL endpoint for the control plane
    - telemetryEndpoint: String - URL endpoint for telemetry
    - hasCloudGateway: Boolean - Whether cloud gateway is enabled
    - labels: Object - Labels assigned to this control plane
    - metadata: Object - Creation and update timestamps
  - relatedTools: Array - List of related tools for further analysis
Parameters|Type|Description
-|-|-
`controlPlaneId`|`string`|Control Plane ID (obtainable from list-control-planes tool)

---
#### Tool: **`list_consumers`**
List all consumers associated with a control plane.

INPUT:
  - controlPlaneId: String - ID of the control plane
  - size: Number - Number of consumers to return (1-1000, default: 100)
  - offset: String (optional) - Pagination offset token from previous response

OUTPUT:
  - metadata: Object - Contains controlPlaneId, size, offset, nextOffset, totalCount
  - consumers: Array - List of consumers with details for each including:
    - consumerId: String - Unique identifier for the consumer
    - username: String - Username for this consumer
    - customId: String - Custom identifier for this consumer
    - tags: Array - Tags associated with the consumer
    - enabled: Boolean - Whether the consumer is enabled
    - metadata: Object - Creation and update timestamps
  - relatedTools: Array - List of related tools for consumer analysis
Parameters|Type|Description
-|-|-
`controlPlaneId`|`string`|Control Plane ID (obtainable from list-control-planes tool)
`offset`|`string` *optional*|Offset token for pagination (from previous response)
`size`|`integer` *optional*|Number of consumers to return

---
#### Tool: **`list_control_plane_group_memberships`**
List all control planes that are members of a specific control plane group.

INPUT:
  - groupId: String - ID of the control plane group (control plane that acts as the group)
  - pageSize: Number - Number of members to return per page (1-1000, default: 10)
  - pageAfter: String (optional) - Cursor for pagination after a specific item

OUTPUT:
  - metadata: Object - Contains groupId, pageSize, pageAfter, nextPageAfter, totalCount
  - members: Array - List of member control planes with details for each including:
    - controlPlaneId: String - Unique identifier for the control plane
    - name: String - Display name of the control plane
    - description: String - Description of the control plane
    - type: String - Type of the control plane
    - clusterType: String - Underlying cluster type
    - membershipStatus: Object - Group membership status including:
      - status: String - Current status (OK, CONFLICT, etc.)
      - message: String - Status message
      - conflicts: Array - List of configuration conflicts if any
    - metadata: Object - Creation and update timestamps
  - relatedTools: Array - List of related tools for group management
Parameters|Type|Description
-|-|-
`groupId`|`string`|Control plane group ID (the ID of the control plane that acts as the group)
`pageAfter`|`string` *optional*|Cursor for pagination after a specific item
`pageSize`|`integer` *optional*|Number of members to return per page

---
#### Tool: **`list_control_planes`**
List all control planes in your organization.

INPUT:
  - pageSize: Number - Number of control planes per page (1-1000, default: 10)
  - pageNumber: Number (optional) - Page number to retrieve
  - filterName: String (optional) - Filter control planes by name
  - filterClusterType: String (optional) - Filter by cluster type (kubernetes, docker, etc.)
  - filterCloudGateway: Boolean (optional) - Filter by cloud gateway capability
  - labels: String (optional) - Filter by labels (format: 'key:value,existCheck')
  - sort: String (optional) - Sort field and direction (e.g. 'name,created_at desc')

OUTPUT:
  - metadata: Object - Contains pageSize, pageNumber, totalPages, totalCount, filters, sort
  - controlPlanes: Array - List of control planes with details for each including:
    - controlPlaneId: String - Unique identifier for the control plane
    - name: String - Display name of the control plane
    - description: String - Description of the control plane
    - type: String - Type of the control plane
    - clusterType: String - Underlying cluster type
    - controlPlaneEndpoint: String - URL endpoint for the control plane
    - telemetryEndpoint: String - URL endpoint for telemetry
    - hasCloudGateway: Boolean - Whether cloud gateway is enabled
    - labels: Object - Labels assigned to this control plane
    - metadata: Object - Creation and update timestamps
  - usage: Object - Information about how to use these results
Parameters|Type|Description
-|-|-
`filterCloudGateway`|`boolean` *optional*|Filter by cloud gateway capability
`filterClusterType`|`string` *optional*|Filter by cluster type (e.g., 'kubernetes', 'docker')
`filterName`|`string` *optional*|Filter control planes by name (contains)
`labels`|`string` *optional*|Filter by labels (format: 'key:value,existCheck')
`pageNumber`|`integer` *optional*|Page number to retrieve
`pageSize`|`integer` *optional*|Number of control planes per page
`sort`|`string` *optional*|Sort field and direction (e.g. 'name,created_at desc')

---
#### Tool: **`list_plugins`**
List all plugins associated with a control plane.

INPUT:
  - controlPlaneId: String - ID of the control plane
  - size: Number - Number of plugins to return (1-1000, default: 100)
  - offset: String (optional) - Pagination offset token from previous response

OUTPUT:
  - metadata: Object - Contains controlPlaneId, size, offset, nextOffset, totalCount
  - plugins: Array - List of plugins with details for each including:
    - pluginId: String - Unique identifier for the plugin
    - name: String - Name of the plugin (e.g., rate-limiting, cors, etc.)
    - enabled: Boolean - Whether the plugin is enabled
    - config: Object - Plugin-specific configuration
    - protocols: Array - Protocols this plugin applies to
    - tags: Array - Tags associated with the plugin
    - scoping: Object - Defines plugin scope including:
      - consumerId: String - Consumer this plugin applies to (if any)
      - serviceId: String - Service this plugin applies to (if any)
      - routeId: String - Route this plugin applies to (if any)
      - global: Boolean - Whether this is a global plugin
    - metadata: Object - Creation and update timestamps
  - relatedTools: Array - List of related tools for plugin configuration
Parameters|Type|Description
-|-|-
`controlPlaneId`|`string`|Control Plane ID (obtainable from list-control-planes tool)
`offset`|`string` *optional*|Offset token for pagination (from previous response)
`size`|`integer` *optional*|Number of plugins to return

---
#### Tool: **`list_routes`**
List all routes associated with a control plane.

INPUT:
  - controlPlaneId: String - ID of the control plane
  - size: Number - Number of routes to return (1-1000, default: 100)
  - offset: String (optional) - Pagination offset token from previous response

OUTPUT:
  - metadata: Object - Contains controlPlaneId, size, offset, nextOffset, totalCount
  - routes: Array - List of routes with details for each including:
    - routeId: String - Unique identifier for the route
    - name: String - Display name of the route
    - protocols: Array - Protocols this route accepts (http, https, grpc, etc.)
    - methods: Array - HTTP methods this route accepts
    - hosts: Array - Hostnames this route matches
    - paths: Array - URL paths this route matches
    - stripPath: Boolean - Whether to strip the matched path prefix
    - preserveHost: Boolean - Whether to preserve the host header
    - serviceId: String - ID of the service this route forwards to
    - enabled: Boolean - Whether the route is enabled
    - metadata: Object - Creation and update timestamps
  - relatedTools: Array - List of related tools for further analysis
Parameters|Type|Description
-|-|-
`controlPlaneId`|`string`|Control Plane ID (obtainable from list-control-planes tool)
`offset`|`string` *optional*|Offset token for pagination (from previous response)
`size`|`integer` *optional*|Number of routes to return

---
#### Tool: **`list_services`**
List all services associated with a control plane.

INPUT:
  - controlPlaneId: String - ID of the control plane
  - size: Number - Number of services to return (1-1000, default: 100)
  - offset: String (optional) - Pagination offset token from previous response

OUTPUT:
  - metadata: Object - Contains controlPlaneId, size, offset, nextOffset, totalCount
  - services: Array - List of services with details for each including:
    - serviceId: String - Unique identifier for the service
    - name: String - Display name of the service
    - host: String - Target host for the service
    - port: Number - Target port for the service
    - protocol: String - Protocol used (http, https, grpc, etc.)
    - path: String - Path prefix for the service
    - retries: Number - Number of retries on failure
    - connectTimeout: Number - Connection timeout in milliseconds
    - writeTimeout: Number - Write timeout in milliseconds
    - readTimeout: Number - Read timeout in milliseconds
    - tags: Array - Tags associated with the service
    - enabled: Boolean - Whether the service is enabled
    - metadata: Object - Creation and update timestamps
  - relatedTools: Array - List of related tools for further analysis
Parameters|Type|Description
-|-|-
`controlPlaneId`|`string`|Control Plane ID (obtainable from list-control-planes tool)
`offset`|`string` *optional*|Offset token for pagination (from previous response)
`size`|`integer` *optional*|Number of services to return

---
#### Tool: **`query_api_requests`**
Query and analyze Kong API Gateway requests with customizable filters. 
Before calling this it's necessary to have a controlPlaneID and a serviceID or routeID. 
These can be obtained using the list-control-planes, list-services, and list-routes tools.

INPUT:
  - timeRange: String - Time range for data retrieval (15M, 1H, 6H, 12H, 24H, 7D)
  - statusCodes: Number[] (optional) - Filter by specific HTTP status codes
  - excludeStatusCodes: Number[] (optional) - Exclude specific HTTP status codes
  - httpMethods: String[] (optional) - Filter by HTTP methods (e.g., GET, POST)
  - consumerIds: String[] (optional) - Filter by consumer IDs
  - serviceIds: String[] (optional) - Filter by service IDs. The format of this field must be "<controlPlaneID>:<serviceID>". 
  - routeIds: String[] (optional) - Filter by route IDs. The format of this field must be "<controlPlaneID:routeID>"
  - maxResults: Number - Maximum number of results to return (1-1000)

OUTPUT:
  - metadata: Object - Contains totalRequests, timeRange, and applied filters
  - requests: Array - List of request objects with details including:
    - requestId: String - Unique request identifier
    - timestamp: String - When the request occurred
    - httpMethod: String - HTTP method used (GET, POST, etc.)
    - uri: String - Request URI path
    - statusCode: Number - HTTP status code of the response
    - consumerId: String - ID of the consumer making the request
    - serviceId: String - ID of the service handling the request
    - routeId: String - ID of the matched route
    - latency: Object - Response time metrics
    - clientIp: String - IP address of the client
    - and many more detailed fields...
Parameters|Type|Description
-|-|-
`consumerIds`|`array` *optional*|Filter by consumer IDs
`excludeStatusCodes`|`array` *optional*|Exclude specific HTTP status codes (e.g. [400, 401, 500])
`httpMethods`|`array` *optional*|Filter by HTTP methods (e.g. ['GET', 'POST', 'DELETE'])
`maxResults`|`integer` *optional*|Number of items to return per page
`routeIds`|`array` *optional*|Filter by route IDs (from list-routes tool)
`serviceIds`|`array` *optional*|Filter by service IDs
`statusCodes`|`array` *optional*|Filter by specific HTTP status codes (e.g. [200, 201, 404])
`timeRange`|`string` *optional*|Time range for data retrieval (15M = 15 minutes, 1H = 1 hour, etc.)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "kong": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "KONNECT_REGION",
        "-e",
        "KONNECT_ACCESS_TOKEN",
        "mcp/kong"
      ],
      "env": {
        "KONNECT_REGION": "us",
        "KONNECT_ACCESS_TOKEN": "kpat_api_key_here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
