# Grafana MCP Server

MCP server for Grafana.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/grafana](https://hub.docker.com/repository/docker/mcp/grafana)
**Author**|[grafana](https://github.com/grafana)
**Repository**|https://github.com/grafana/mcp-grafana
**Dockerfile**|https://github.com/grafana/mcp-grafana/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/grafana)
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`add_activity_to_incident`|Add a note to an incident's timeline.|
`create_incident`|Create an incident|
`get_alert_rule_by_uid`|Retrieves detailed information about a specific alert rule by its UID.|
`get_current_oncall_users`|Get users currently on-call for a specific schedule.|
`get_dashboard_by_uid`|Get dashboard by uid|
`get_datasource_by_name`|Get datasource by name|
`get_datasource_by_uid`|Get datasource by uid|
`get_incident`|Get a single incident by ID.|
`get_oncall_shift`|Get details for a specific OnCall shift.|
`list_alert_rules`|Lists alert rules with their current states (pending, firing, error, recovering, inactive) and labels.|
`list_contact_points`|Lists notification contact points with their type, name, and configuration.|
`list_datasources`|List datasources|
`list_incidents`|List incidents|
`list_loki_label_names`|List all available label names in a Loki datasource for the given time range.|
`list_loki_label_values`|Retrieve all possible values for a specific label in Loki within the given time range.|
`list_oncall_schedules`|List OnCall schedules.|
`list_oncall_teams`|List teams from Grafana OnCall|
`list_oncall_users`|List users from Grafana OnCall.|
`list_prometheus_label_names`|List the label names in a Prometheus datasource|
`list_prometheus_label_values`|Get the values of a label in Prometheus|
`list_prometheus_metric_metadata`|List Prometheus metric metadata|
`list_prometheus_metric_names`|List metric names in a Prometheus datasource that match the given regex|
`query_loki_logs`|Query and retrieve log entries or metric values from a Loki datasource using LogQL.|
`query_loki_stats`|Query statistics about log streams in a Loki datasource, using LogQL selectors to select streams|
`query_prometheus`|Query Prometheus using a range or instant request|
`search_dashboards`|Search for dashboards|

---
## Tools Details

#### Tool: **`add_activity_to_incident`**
Add a note to an incident's timeline. The note will appear in the incident's activity feed. Use this if there is a request to add context to an incident with a note.
Parameters|Type|Description
-|-|-
`body`|`string` *optional*|The body of the activity. URLs will be parsed and attached as context
`eventTime`|`string` *optional*|The time that the activity occurred. If not provided, the current time will be used
`incidentId`|`string` *optional*|The ID of the incident to add the activity to

---
#### Tool: **`create_incident`**
Create an incident
Parameters|Type|Description
-|-|-
`attachCaption`|`string` *optional*|The caption of the attachment
`attachUrl`|`string` *optional*|The URL of the attachment
`isDrill`|`boolean` *optional*|Whether the incident is a drill incident
`labels`|`array` *optional*|The labels to add to the incident
`roomPrefix`|`string` *optional*|The prefix of the room to create the incident in
`severity`|`string` *optional*|The severity of the incident
`status`|`string` *optional*|The status of the incident
`title`|`string` *optional*|The title of the incident

---
#### Tool: **`get_alert_rule_by_uid`**
Retrieves detailed information about a specific alert rule by its UID.
Parameters|Type|Description
-|-|-
`uid`|`string`|The uid of the alert rule

---
#### Tool: **`get_current_oncall_users`**
Get users currently on-call for a specific schedule. A schedule is a calendar-based system defining when team members are on-call. This tool will return info about all users currently on-call for the schedule, regardless of team.
Parameters|Type|Description
-|-|-
`scheduleId`|`string`|The ID of the schedule to get current on-call users for

---
#### Tool: **`get_dashboard_by_uid`**
Get dashboard by uid
Parameters|Type|Description
-|-|-
`uid`|`string`|The UID of the dashboard

---
#### Tool: **`get_datasource_by_name`**
Get datasource by name
Parameters|Type|Description
-|-|-
`name`|`string`|The name of the datasource

---
#### Tool: **`get_datasource_by_uid`**
Get datasource by uid
Parameters|Type|Description
-|-|-
`uid`|`string`|The uid of the datasource

---
#### Tool: **`get_incident`**
Get a single incident by ID. Returns the full incident details including title, status, severity, and other metadata.
Parameters|Type|Description
-|-|-
`id`|`string` *optional*|The ID of the incident to retrieve

---
#### Tool: **`get_oncall_shift`**
Get details for a specific OnCall shift. A shift represents a designated time period within a rotation when a team or individual is actively on-call
Parameters|Type|Description
-|-|-
`shiftId`|`string`|The ID of the shift to get details for

---
#### Tool: **`list_alert_rules`**
Lists alert rules with their current states (pending, firing, error, recovering, inactive) and labels. Inactive state means the alert state is normal, not firing.
Parameters|Type|Description
-|-|-
`label_selectors`|`array` *optional*|Optionally, a list of matchers to filter alert rules by labels
`limit`|`integer` *optional*|The maximum number of results to return. Default is 100.
`page`|`integer` *optional*|The page number to return.

---
#### Tool: **`list_contact_points`**
Lists notification contact points with their type, name, and configuration.
Parameters|Type|Description
-|-|-
`limit`|`integer` *optional*|The maximum number of results to return. Default is 100.
`name`|`string` *optional*|Filter contact points by name

---
#### Tool: **`list_datasources`**
List datasources
Parameters|Type|Description
-|-|-
`type`|`string` *optional*|The type of datasources to search for. For example, 'prometheus', 'loki', 'tempo', etc...

---
#### Tool: **`list_incidents`**
List incidents
Parameters|Type|Description
-|-|-
`drill`|`boolean` *optional*|Whether to include drill incidents
`limit`|`integer` *optional*|The maximum number of incidents to return
`status`|`string` *optional*|The status of the incidents to include. Valid values: 'active', 'resolved'

---
#### Tool: **`list_loki_label_names`**
List all available label names in a Loki datasource for the given time range. Returns the set of unique label keys found in the logs.
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`endRfc3339`|`string` *optional*|Optionally, the end time of the query in RFC3339 format (defaults to now)
`startRfc3339`|`string` *optional*|Optionally, the start time of the query in RFC3339 format (defaults to 1 hour ago)

---
#### Tool: **`list_loki_label_values`**
Retrieve all possible values for a specific label in Loki within the given time range. Useful for exploring available options for filtering logs.
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`labelName`|`string`|The name of the label to retrieve values for (e.g. 'app', 'env', 'pod')
`endRfc3339`|`string` *optional*|Optionally, the end time of the query in RFC3339 format (defaults to now)
`startRfc3339`|`string` *optional*|Optionally, the start time of the query in RFC3339 format (defaults to 1 hour ago)

---
#### Tool: **`list_oncall_schedules`**
List OnCall schedules. A schedule is a calendar-based system defining when team members are on-call. Optionally provide a scheduleId to get details for a specific schedule
Parameters|Type|Description
-|-|-
`page`|`integer` *optional*|The page number to return (1-based)
`scheduleId`|`string` *optional*|The ID of the schedule to get details for. If provided, returns only that schedule's details
`teamId`|`string` *optional*|The ID of the team to list schedules for

---
#### Tool: **`list_oncall_teams`**
List teams from Grafana OnCall
Parameters|Type|Description
-|-|-
`page`|`integer` *optional*|The page number to return

---
#### Tool: **`list_oncall_users`**
List users from Grafana OnCall. If user ID is provided, returns details for that specific user. If username is provided, returns the user matching that username
Parameters|Type|Description
-|-|-
`page`|`integer` *optional*|The page number to return
`userId`|`string` *optional*|The ID of the user to get details for. If provided, returns only that user's details
`username`|`string` *optional*|The username to filter users by. If provided, returns only the user matching this username

---
#### Tool: **`list_prometheus_label_names`**
List the label names in a Prometheus datasource
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`endRfc3339`|`string` *optional*|Optionally, the end time of the time range to filter the results by
`limit`|`integer` *optional*|Optionally, the maximum number of results to return
`matches`|`array` *optional*|Optionally, a list of label matchers to filter the results by
`startRfc3339`|`string` *optional*|Optionally, the start time of the time range to filter the results by

---
#### Tool: **`list_prometheus_label_values`**
Get the values of a label in Prometheus
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`labelName`|`string`|The name of the label to query
`endRfc3339`|`string` *optional*|Optionally, the end time of the query
`limit`|`integer` *optional*|Optionally, the maximum number of results to return
`matches`|`array` *optional*|Optionally, a list of selectors to filter the results by
`startRfc3339`|`string` *optional*|Optionally, the start time of the query

---
#### Tool: **`list_prometheus_metric_metadata`**
List Prometheus metric metadata
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`limit`|`integer` *optional*|The maximum number of metrics to return
`limitPerMetric`|`integer` *optional*|The maximum number of metrics to return per metric
`metric`|`string` *optional*|The metric to query

---
#### Tool: **`list_prometheus_metric_names`**
List metric names in a Prometheus datasource that match the given regex
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`limit`|`integer` *optional*|The maximum number of results to return
`page`|`integer` *optional*|The page number to return
`regex`|`string` *optional*|The regex to match against the metric names

---
#### Tool: **`query_loki_logs`**
Query and retrieve log entries or metric values from a Loki datasource using LogQL. Returns either log lines or numeric values with timestamps and labels. Use `query_loki_stats` first to check stream size, then `list_loki_label_names` and `list_loki_label_values` to verify labels exist. Supports full LogQL syntax including both log queries and metric queries (e.g., rate, count_over_time).
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`logql`|`string`|The LogQL query to execute against Loki. This can be a simple label matcher or a complex query with filters, parsers, and expressions. Supports full LogQL syntax including label matchers, filter operators, pattern expressions, and pipeline operations.
`direction`|`string` *optional*|Optionally, the direction of the query: 'forward' (oldest first) or 'backward' (newest first, default)
`endRfc3339`|`string` *optional*|Optionally, the end time of the query in RFC3339 format
`limit`|`integer` *optional*|Optionally, the maximum number of log lines to return (default: 10, max: 100)
`startRfc3339`|`string` *optional*|Optionally, the start time of the query in RFC3339 format

---
#### Tool: **`query_loki_stats`**
Query statistics about log streams in a Loki datasource, using LogQL selectors to select streams
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`logql`|`string`|The LogQL matcher expression to execute. This parameter only accepts label matcher expressions and does not support full LogQL queries. Line filters, pattern operations, and metric aggregations are not supported by the stats API endpoint. Only simple label selectors can be used here.
`endRfc3339`|`string` *optional*|Optionally, the end time of the query in RFC3339 format
`startRfc3339`|`string` *optional*|Optionally, the start time of the query in RFC3339 format

---
#### Tool: **`query_prometheus`**
Query Prometheus using a range or instant request
Parameters|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`expr`|`string`|The PromQL expression to query
`startRfc3339`|`string`|The start time in RFC3339 format
`endRfc3339`|`string` *optional*|The end time in RFC3339 format. Required if queryType is 'range', ignored if queryType is 'instant'
`queryType`|`string` *optional*|The type of query to use. Either 'range' or 'instant'
`stepSeconds`|`integer` *optional*|The time series step size in seconds. Required if queryType is 'range', ignored if queryType is 'instant'

---
#### Tool: **`search_dashboards`**
Search for dashboards
Parameters|Type|Description
-|-|-
`query`|`string` *optional*|The query to search for

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "grafana": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GRAFANA_URL",
        "-e",
        "GRAFANA_API_KEY",
        "mcp/grafana",
        "--transport=stdio"
      ],
      "env": {
        "GRAFANA_URL": "http://localhost:3000",
        "GRAFANA_API_KEY": "<your service account token>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
