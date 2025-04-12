# kubernetes MCP Server

Connect to a Kubernetes cluster and manage it

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [Flux159](https://github.com/Flux159) |
| **Repository** | https://github.com/Flux159/mcp-server-kubernetes |
| **Dockerfile** | https://github.com/Flux159/mcp-server-kubernetes/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`cleanup`**: Cleanup all managed resources
 1. **`create_configmap`**: Create a new Kubernetes ConfigMap
 1. **`create_cronjob`**: Create a new Kubernetes CronJob
 1. **`create_deployment`**: Create a new Kubernetes deployment
 1. **`create_namespace`**: Create a new Kubernetes namespace
 1. **`create_pod`**: Create a new Kubernetes pod
 1. **`delete_cronjob`**: Delete a Kubernetes CronJob
 1. **`delete_deployment`**: Delete a Kubernetes deployment
 1. **`delete_namespace`**: Delete a Kubernetes namespace
 1. **`delete_pod`**: Delete a Kubernetes pod
 1. **`describe_cronjob`**: Get detailed information about a Kubernetes CronJob including recent job history
 1. **`describe_deployment`**: Get details about a Kubernetes deployment
 1. **`describe_pod`**: Describe a Kubernetes pod (read details like status, containers, etc.)
 1. **`explain_resource`**: Get documentation for a Kubernetes resource or field
 1. **`get_events`**: Get Kubernetes events from the cluster
 1. **`get_job_logs`**: Get logs from Pods created by a specific Job
 1. **`get_logs`**: Get logs from pods, deployments, jobs, or resources matching a label selector
 1. **`install_helm_chart`**: Install a Helm chart
 1. **`list_api_resources`**: List the API resources available in the cluster
 1. **`list_cronjobs`**: List CronJobs in a namespace
 1. **`list_deployments`**: List deployments in a namespace
 1. **`list_jobs`**: List Jobs in a namespace, optionally filtered by a CronJob parent
 1. **`list_namespaces`**: List all namespaces
 1. **`list_nodes`**: List all nodes in the cluster
 1. **`list_pods`**: List pods in a namespace
 1. **`list_services`**: List services in a namespace
 1. **`port_forward`**: Forward a local port to a port on a Kubernetes resource
 1. **`scale_deployment`**: Scale a Kubernetes deployment
 1. **`stop_port_forward`**: Stop a port-forward process
 1. **`uninstall_helm_chart`**: Uninstall a Helm release
 1. **`upgrade_helm_chart`**: Upgrade a Helm release

## Tools

### Tool: **`cleanup`**

Cleanup all managed resources

### Tool: **`create_configmap`**

Create a new Kubernetes ConfigMap

| Parameter | Type | Description |
| - | - | - |
| `data` | `object` |  |
| `name` | `string` |  |
| `namespace` | `string` |  |

### Tool: **`create_cronjob`**

Create a new Kubernetes CronJob

| Parameter | Type | Description |
| - | - | - |
| `image` | `string` |  |
| `name` | `string` |  |
| `namespace` | `string` |  |
| `schedule` | `string` |  |
| `command` | `array` *optional* |  |
| `suspend` | `boolean` *optional* |  |

### Tool: **`create_deployment`**

Create a new Kubernetes deployment

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |
| `template` | `string` |  |
| `customConfig` | `object` *optional* |  |
| `ports` | `array` *optional* |  |
| `replicas` | `number` *optional* |  |

### Tool: **`create_namespace`**

Create a new Kubernetes namespace

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |

### Tool: **`create_pod`**

Create a new Kubernetes pod

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |
| `template` | `string` |  |
| `command` | `array` *optional* |  |
| `customConfig` | `object` *optional* |  |

### Tool: **`delete_cronjob`**

Delete a Kubernetes CronJob

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |

### Tool: **`delete_deployment`**

Delete a Kubernetes deployment

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |
| `ignoreNotFound` | `boolean` *optional* |  |

### Tool: **`delete_namespace`**

Delete a Kubernetes namespace

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `ignoreNotFound` | `boolean` *optional* |  |

### Tool: **`delete_pod`**

Delete a Kubernetes pod

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |
| `ignoreNotFound` | `boolean` *optional* |  |

### Tool: **`describe_cronjob`**

Get detailed information about a Kubernetes CronJob including recent job history

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |

### Tool: **`describe_deployment`**

Get details about a Kubernetes deployment

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |

### Tool: **`describe_pod`**

Describe a Kubernetes pod (read details like status, containers, etc.)

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |

### Tool: **`explain_resource`**

Get documentation for a Kubernetes resource or field

| Parameter | Type | Description |
| - | - | - |
| `resource` | `string` | Resource name or field path (e.g. 'pods' or 'pods.spec.containers') |
| `apiVersion` | `string` *optional* | API version to use (e.g. 'apps/v1') |
| `output` | `string` *optional* | Output format (plaintext or plaintext-openapiv2) |
| `recursive` | `boolean` *optional* | Print the fields of fields recursively |

### Tool: **`get_events`**

Get Kubernetes events from the cluster

| Parameter | Type | Description |
| - | - | - |
| `fieldSelector` | `string` *optional* | Field selector to filter events |
| `namespace` | `string` *optional* | Namespace to get events from. If not specified, gets events from all namespaces |

### Tool: **`get_job_logs`**

Get logs from Pods created by a specific Job

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Name of the Job to get logs from |
| `namespace` | `string` |  |
| `tail` | `number` *optional* | Number of lines to return from the end of the logs |
| `timestamps` | `boolean` *optional* | Include timestamps in the logs |

### Tool: **`get_logs`**

Get logs from pods, deployments, jobs, or resources matching a label selector

| Parameter | Type | Description |
| - | - | - |
| `resourceType` | `string` | Type of resource to get logs from |
| `container` | `string` *optional* | Container name (required when pod has multiple containers) |
| `labelSelector` | `string` *optional* | Label selector to filter resources |
| `name` | `string` *optional* | Name of the resource |
| `namespace` | `string` *optional* | Namespace of the resource |
| `since` | `number` *optional* | Get logs since relative time in seconds |
| `tail` | `number` *optional* | Number of lines to show from end of logs |
| `timestamps` | `boolean` *optional* | Include timestamps in logs |

### Tool: **`install_helm_chart`**

Install a Helm chart

| Parameter | Type | Description |
| - | - | - |
| `chart` | `string` | Chart name |
| `name` | `string` | Release name |
| `namespace` | `string` | Kubernetes namespace |
| `repo` | `string` | Chart repository URL |
| `values` | `object` *optional* | Chart values |

### Tool: **`list_api_resources`**

List the API resources available in the cluster

| Parameter | Type | Description |
| - | - | - |
| `apiGroup` | `string` *optional* | API group to filter by |
| `namespaced` | `boolean` *optional* | If true, only show namespaced resources |
| `output` | `string` *optional* | Output format (wide, name, or no-headers) |
| `verbs` | `array` *optional* | List of verbs to filter by |

### Tool: **`list_cronjobs`**

List CronJobs in a namespace

| Parameter | Type | Description |
| - | - | - |
| `namespace` | `string` |  |

### Tool: **`list_deployments`**

List deployments in a namespace

| Parameter | Type | Description |
| - | - | - |
| `namespace` | `string` |  |

### Tool: **`list_jobs`**

List Jobs in a namespace, optionally filtered by a CronJob parent

| Parameter | Type | Description |
| - | - | - |
| `namespace` | `string` |  |
| `cronJobName` | `string` *optional* | Optional: Filter jobs created by a specific CronJob |

### Tool: **`list_namespaces`**

List all namespaces

### Tool: **`list_nodes`**

List all nodes in the cluster

### Tool: **`list_pods`**

List pods in a namespace

| Parameter | Type | Description |
| - | - | - |
| `namespace` | `string` |  |

### Tool: **`list_services`**

List services in a namespace

| Parameter | Type | Description |
| - | - | - |
| `namespace` | `string` |  |

### Tool: **`port_forward`**

Forward a local port to a port on a Kubernetes resource

| Parameter | Type | Description |
| - | - | - |
| `localPort` | `number` |  |
| `resourceName` | `string` |  |
| `resourceType` | `string` |  |
| `targetPort` | `number` |  |
| `namespace` | `string` *optional* |  |

### Tool: **`scale_deployment`**

Scale a Kubernetes deployment

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `namespace` | `string` |  |
| `replicas` | `number` |  |

### Tool: **`stop_port_forward`**

Stop a port-forward process

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` |  |

### Tool: **`uninstall_helm_chart`**

Uninstall a Helm release

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | Release name |
| `namespace` | `string` | Kubernetes namespace |

### Tool: **`upgrade_helm_chart`**

Upgrade a Helm release

| Parameter | Type | Description |
| - | - | - |
| `chart` | `string` | Chart name |
| `name` | `string` | Release name |
| `namespace` | `string` | Kubernetes namespace |
| `repo` | `string` | Chart repository URL |
| `values` | `object` *optional* | Chart values |

## Use this MCP Server

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/kubernetes"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/kubernetes -f Dockerfile https://github.com/Flux159/mcp-server-kubernetes.git
```

