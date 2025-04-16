# Kubernetes MCP Server

Connect to a Kubernetes cluster and manage it

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[Flux159](https://github.com/Flux159)
**Repository**|https://github.com/Flux159/mcp-server-kubernetes
**Dockerfile**|https://github.com/Flux159/mcp-server-kubernetes/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`cleanup`|Cleanup all managed resources|
`create_configmap`|Create a new Kubernetes ConfigMap|
`create_cronjob`|Create a new Kubernetes CronJob|
`create_deployment`|Create a new Kubernetes deployment|
`create_namespace`|Create a new Kubernetes namespace|
`create_pod`|Create a new Kubernetes pod|
`create_service`|Create a new Kubernetes service|
`delete_cronjob`|Delete a Kubernetes CronJob|
`delete_deployment`|Delete a Kubernetes deployment|
`delete_namespace`|Delete a Kubernetes namespace|
`delete_pod`|Delete a Kubernetes pod|
`describe_cronjob`|Get detailed information about a Kubernetes CronJob including recent job history|
`describe_deployment`|Get details about a Kubernetes deployment|
`describe_pod`|Describe a Kubernetes pod (read details like status, containers, etc.)|
`explain_resource`|Get documentation for a Kubernetes resource or field|
`get_current_context`|Get the current Kubernetes context|
`get_events`|Get Kubernetes events from the cluster|
`get_job_logs`|Get logs from Pods created by a specific Job|
`get_logs`|Get logs from pods, deployments, jobs, or resources matching a label selector|
`install_helm_chart`|Install a Helm chart|
`list_api_resources`|List the API resources available in the cluster|
`list_contexts`|List all available Kubernetes contexts|
`list_cronjobs`|List CronJobs in a namespace|
`list_deployments`|List deployments in a namespace|
`list_jobs`|List Jobs in a namespace, optionally filtered by a CronJob parent|
`list_namespaces`|List all namespaces|
`list_nodes`|List all nodes in the cluster|
`list_pods`|List pods in a namespace|
`list_services`|List services in a namespace|
`port_forward`|Forward a local port to a port on a Kubernetes resource|
`scale_deployment`|Scale a Kubernetes deployment|
`set_current_context`|Set the current Kubernetes context|
`stop_port_forward`|Stop a port-forward process|
`uninstall_helm_chart`|Uninstall a Helm release|
`update_deployment`|Update an existing kubernetes deployment in cluster|
`upgrade_helm_chart`|Upgrade a Helm release|

---
## Tools Details

#### Tool: `cleanup`
|Description|
|-|
|Cleanup all managed resources|

#### Tool: `create_configmap`
|Description|
|-|
|Create a new Kubernetes ConfigMap|

Parameters|Type|Description
-|-|-
`data`|`object`|
`name`|`string`|
`namespace`|`string`|

---
#### Tool: `create_cronjob`
|Description|
|-|
|Create a new Kubernetes CronJob|

Parameters|Type|Description
-|-|-
`image`|`string`|
`name`|`string`|
`namespace`|`string`|
`schedule`|`string`|
`command`|`array` *optional*|
`suspend`|`boolean` *optional*|

---
#### Tool: `create_deployment`
|Description|
|-|
|Create a new Kubernetes deployment|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|
`template`|`string`|
`customConfig`|`object` *optional*|
`ports`|`array` *optional*|
`replicas`|`number` *optional*|

---
#### Tool: `create_namespace`
|Description|
|-|
|Create a new Kubernetes namespace|

Parameters|Type|Description
-|-|-
`name`|`string`|

---
#### Tool: `create_pod`
|Description|
|-|
|Create a new Kubernetes pod|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|
`template`|`string`|
`command`|`array` *optional*|
`customConfig`|`object` *optional*|

---
#### Tool: `create_service`
|Description|
|-|
|Create a new Kubernetes service|

Parameters|Type|Description
-|-|-
`name`|`string`|
`ports`|`array`|
`namespace`|`string` *optional*|
`selector`|`object` *optional*|
`type`|`string` *optional*|

---
#### Tool: `delete_cronjob`
|Description|
|-|
|Delete a Kubernetes CronJob|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|

---
#### Tool: `delete_deployment`
|Description|
|-|
|Delete a Kubernetes deployment|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|
`ignoreNotFound`|`boolean` *optional*|

---
#### Tool: `delete_namespace`
|Description|
|-|
|Delete a Kubernetes namespace|

Parameters|Type|Description
-|-|-
`name`|`string`|
`ignoreNotFound`|`boolean` *optional*|

---
#### Tool: `delete_pod`
|Description|
|-|
|Delete a Kubernetes pod|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|
`ignoreNotFound`|`boolean` *optional*|

---
#### Tool: `describe_cronjob`
|Description|
|-|
|Get detailed information about a Kubernetes CronJob including recent job history|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|

---
#### Tool: `describe_deployment`
|Description|
|-|
|Get details about a Kubernetes deployment|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|

---
#### Tool: `describe_pod`
|Description|
|-|
|Describe a Kubernetes pod (read details like status, containers, etc.)|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|

---
#### Tool: `explain_resource`
|Description|
|-|
|Get documentation for a Kubernetes resource or field|

Parameters|Type|Description
-|-|-
`resource`|`string`|Resource name or field path (e.g. 'pods' or 'pods.spec.containers')
`apiVersion`|`string` *optional*|API version to use (e.g. 'apps/v1')
`output`|`string` *optional*|Output format (plaintext or plaintext-openapiv2)
`recursive`|`boolean` *optional*|Print the fields of fields recursively

---
#### Tool: `get_current_context`
|Description|
|-|
|Get the current Kubernetes context|

Parameters|Type|Description
-|-|-
`detailed`|`boolean` *optional*|Include detailed information about the current context

---
#### Tool: `get_events`
|Description|
|-|
|Get Kubernetes events from the cluster|

Parameters|Type|Description
-|-|-
`fieldSelector`|`string` *optional*|Field selector to filter events
`namespace`|`string` *optional*|Namespace to get events from. If not specified, gets events from all namespaces

---
#### Tool: `get_job_logs`
|Description|
|-|
|Get logs from Pods created by a specific Job|

Parameters|Type|Description
-|-|-
`name`|`string`|Name of the Job to get logs from
`namespace`|`string`|
`tail`|`number` *optional*|Number of lines to return from the end of the logs
`timestamps`|`boolean` *optional*|Include timestamps in the logs

---
#### Tool: `get_logs`
|Description|
|-|
|Get logs from pods, deployments, jobs, or resources matching a label selector|

Parameters|Type|Description
-|-|-
`resourceType`|`string`|Type of resource to get logs from
`container`|`string` *optional*|Container name (required when pod has multiple containers)
`labelSelector`|`string` *optional*|Label selector to filter resources
`name`|`string` *optional*|Name of the resource
`namespace`|`string` *optional*|Namespace of the resource
`since`|`number` *optional*|Get logs since relative time in seconds
`tail`|`number` *optional*|Number of lines to show from end of logs
`timestamps`|`boolean` *optional*|Include timestamps in logs

---
#### Tool: `install_helm_chart`
|Description|
|-|
|Install a Helm chart|

Parameters|Type|Description
-|-|-
`chart`|`string`|Chart name
`name`|`string`|Release name
`namespace`|`string`|Kubernetes namespace
`repo`|`string`|Chart repository URL
`values`|`object` *optional*|Chart values

---
#### Tool: `list_api_resources`
|Description|
|-|
|List the API resources available in the cluster|

Parameters|Type|Description
-|-|-
`apiGroup`|`string` *optional*|API group to filter by
`namespaced`|`boolean` *optional*|If true, only show namespaced resources
`output`|`string` *optional*|Output format (wide, name, or no-headers)
`verbs`|`array` *optional*|List of verbs to filter by

---
#### Tool: `list_contexts`
|Description|
|-|
|List all available Kubernetes contexts|

Parameters|Type|Description
-|-|-
`showCurrent`|`boolean` *optional*|Show which context is currently active

---
#### Tool: `list_cronjobs`
|Description|
|-|
|List CronJobs in a namespace|

Parameters|Type|Description
-|-|-
`namespace`|`string`|

---
#### Tool: `list_deployments`
|Description|
|-|
|List deployments in a namespace|

Parameters|Type|Description
-|-|-
`namespace`|`string`|

---
#### Tool: `list_jobs`
|Description|
|-|
|List Jobs in a namespace, optionally filtered by a CronJob parent|

Parameters|Type|Description
-|-|-
`namespace`|`string`|
`cronJobName`|`string` *optional*|Optional: Filter jobs created by a specific CronJob

---
#### Tool: `list_namespaces`
|Description|
|-|
|List all namespaces|

#### Tool: `list_nodes`
|Description|
|-|
|List all nodes in the cluster|

#### Tool: `list_pods`
|Description|
|-|
|List pods in a namespace|

Parameters|Type|Description
-|-|-
`namespace`|`string`|

---
#### Tool: `list_services`
|Description|
|-|
|List services in a namespace|

Parameters|Type|Description
-|-|-
`namespace`|`string`|

---
#### Tool: `port_forward`
|Description|
|-|
|Forward a local port to a port on a Kubernetes resource|

Parameters|Type|Description
-|-|-
`localPort`|`number`|
`resourceName`|`string`|
`resourceType`|`string`|
`targetPort`|`number`|
`namespace`|`string` *optional*|

---
#### Tool: `scale_deployment`
|Description|
|-|
|Scale a Kubernetes deployment|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|
`replicas`|`number`|

---
#### Tool: `set_current_context`
|Description|
|-|
|Set the current Kubernetes context|

Parameters|Type|Description
-|-|-
`name`|`string`|Name of the context to set as current

---
#### Tool: `stop_port_forward`
|Description|
|-|
|Stop a port-forward process|

Parameters|Type|Description
-|-|-
`id`|`string`|

---
#### Tool: `uninstall_helm_chart`
|Description|
|-|
|Uninstall a Helm release|

Parameters|Type|Description
-|-|-
`name`|`string`|Release name
`namespace`|`string`|Kubernetes namespace

---
#### Tool: `update_deployment`
|Description|
|-|
|Update an existing kubernetes deployment in cluster|

Parameters|Type|Description
-|-|-
`name`|`string`|
`namespace`|`string`|
`template`|`string`|
`containerName`|`string` *optional*|Name of the container to update
`customConfig`|`object` *optional*|
`replicas`|`number` *optional*|

---
#### Tool: `upgrade_helm_chart`
|Description|
|-|
|Upgrade a Helm release|

Parameters|Type|Description
-|-|-
`chart`|`string`|Chart name
`name`|`string`|Release name
`namespace`|`string`|Kubernetes namespace
`repo`|`string`|Chart repository URL
`values`|`object` *optional*|Chart values

---
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
