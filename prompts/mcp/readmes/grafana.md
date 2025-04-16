# grafana MCP Server

MCP server for Grafana

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

|<!-- -->|<!-- -->|
|-|-|
**Image Source**|Official Image
|**Author**|[grafana](https://github.com/grafana)
**Repository**|https://github.com/grafana/mcp-grafana
**Dockerfile**|https://github.com/grafana/mcp-grafana/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Licence**|Apache License 2.0

## Summary
1. `add_activity_to_incident` Add a note to an incident's timeline.
1. `create_incident` Create an incident
1. `get_alert_rule_by_uid` Retrieves detailed information about a specific alert rule by its UID.
1. `get_current_oncall_users` Get users currently on-call for a specific schedule.
1. `get_dashboard_by_uid` Get dashboard by uid
1. `get_datasource_by_name` Get datasource by name
1. `get_datasource_by_uid` Get datasource by uid
1. `get_incident` Get a single incident by ID.
1. `get_oncall_shift` Get details for a specific OnCall shift.
1. `list_alert_rules` Lists alert rules with their current states (pending, firing, error, recovering, inactive) and labels.
1. `list_contact_points` Lists notification contact points with their type, name, and configuration.
1. `list_datasources` List datasources
1. `list_incidents` List incidents
1. `list_loki_label_names` List all available label names in a Loki datasource for the given time range.
1. `list_loki_label_values` Retrieve all possible values for a specific label in Loki within the given time range.
1. `list_oncall_schedules` List OnCall schedules.
1. `list_oncall_teams` List teams from Grafana OnCall
1. `list_oncall_users` List users from Grafana OnCall.
1. `list_prometheus_label_names` List the label names in a Prometheus datasource
1. `list_prometheus_label_values` Get the values of a label in Prometheus
1. `list_prometheus_metric_metadata` List Prometheus metric metadata
1. `list_prometheus_metric_names` List metric names in a Prometheus datasource that match the given regex
1. `query_loki_logs` Query and retrieve log entries or metric values from a Loki datasource using LogQL.
1. `query_loki_stats` Query statistics about log streams in a Loki datasource, using LogQL selectors to select streams
1. `query_prometheus` Query Prometheus using a range or instant request
1. `search_dashboards` Search for dashboards

## Tools

### Tool `add_activity_to_incident`
Add a note to an incident's timeline. The note will appear in the incident's activity feed. Use this if there is a request to add context to an incident with a note.

Parameter|Type|Description
-|-|-
`body`|`string` *optional*|The body of the activity. URLs will be parsed and attached as context
`eventTime`|`string` *optional*|The time that the activity occurred. If not provided
`incidentId`|`string` *optional*|The ID of the incident to add the activity to

### Tool `create_incident`
Create an incident

Parameter|Type|Description
-|-|-
`attachCaption`|`string` *optional*|The caption of the attachment
`attachUrl`|`string` *optional*|The URL of the attachment
`isDrill`|`boolean` *optional*|Whether the incident is a drill incident
`labels`|`array` *optional*|The labels to add to the incident
`roomPrefix`|`string` *optional*|The prefix of the room to create the incident in
`severity`|`string` *optional*|The severity of the incident
`status`|`string` *optional*|The status of the incident
`title`|`string` *optional*|The title of the incident

### Tool `get_alert_rule_by_uid`
Retrieves detailed information about a specific alert rule by its UID.

Parameter|Type|Description
-|-|-
`uid`|`string`|The uid of the alert rule

### Tool `get_current_oncall_users`
Get users currently on-call for a specific schedule. A schedule is a calendar-based system defining when team members are on-call. This tool will return info about all users currently on-call for the schedule, regardless of team.

Parameter|Type|Description
-|-|-
`scheduleId`|`string`|The ID of the schedule to get current on-call users for

### Tool `get_dashboard_by_uid`
Get dashboard by uid

Parameter|Type|Description
-|-|-
`uid`|`string`|The UID of the dashboard

### Tool `get_datasource_by_name`
Get datasource by name

Parameter|Type|Description
-|-|-
`name`|`string`|The name of the datasource

### Tool `get_datasource_by_uid`
Get datasource by uid

Parameter|Type|Description
-|-|-
`uid`|`string`|The uid of the datasource

### Tool `get_incident`
Get a single incident by ID. Returns the full incident details including title, status, severity, and other metadata.

Parameter|Type|Description
-|-|-
`id`|`string` *optional*|The ID of the incident to retrieve

### Tool `get_oncall_shift`
Get details for a specific OnCall shift. A shift represents a designated time period within a rotation when a team or individual is actively on-call

Parameter|Type|Description
-|-|-
`shiftId`|`string`|The ID of the shift to get details for

### Tool `list_alert_rules`
Lists alert rules with their current states (pending, firing, error, recovering, inactive) and labels. Inactive state means the alert state is normal, not firing.

Parameter|Type|Description
-|-|-
`label_selectors`|`array` *optional*|Optionally
`limit`|`integer` *optional*|The maximum number of results to return. Default is 100.
`page`|`integer` *optional*|The page number to return.

### Tool `list_contact_points`
Lists notification contact points with their type, name, and configuration.

Parameter|Type|Description
-|-|-
`limit`|`integer` *optional*|The maximum number of results to return. Default is 100.
`name`|`string` *optional*|Filter contact points by name

### Tool `list_datasources`
List datasources

Parameter|Type|Description
-|-|-
`type`|`string` *optional*|The type of datasources to search for. For example

### Tool `list_incidents`
List incidents

Parameter|Type|Description
-|-|-
`drill`|`boolean` *optional*|Whether to include drill incidents
`limit`|`integer` *optional*|The maximum number of incidents to return
`status`|`string` *optional*|The status of the incidents to include. Valid values: 'active'

### Tool `list_loki_label_names`
List all available label names in a Loki datasource for the given time range. Returns the set of unique label keys found in the logs.

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`endRfc3339`|`string` *optional*|Optionally
`startRfc3339`|`string` *optional*|Optionally

### Tool `list_loki_label_values`
Retrieve all possible values for a specific label in Loki within the given time range. Useful for exploring available options for filtering logs.

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`labelName`|`string`|The name of the label to retrieve values for (e.g. 'app'
`endRfc3339`|`string` *optional*|Optionally
`startRfc3339`|`string` *optional*|Optionally

### Tool `list_oncall_schedules`
List OnCall schedules. A schedule is a calendar-based system defining when team members are on-call. Optionally provide a scheduleId to get details for a specific schedule

Parameter|Type|Description
-|-|-
`page`|`integer` *optional*|The page number to return (1-based)
`scheduleId`|`string` *optional*|The ID of the schedule to get details for. If provided
`teamId`|`string` *optional*|The ID of the team to list schedules for

### Tool `list_oncall_teams`
List teams from Grafana OnCall

Parameter|Type|Description
-|-|-
`page`|`integer` *optional*|The page number to return

### Tool `list_oncall_users`
List users from Grafana OnCall. If user ID is provided, returns details for that specific user. If username is provided, returns the user matching that username

Parameter|Type|Description
-|-|-
`page`|`integer` *optional*|The page number to return
`userId`|`string` *optional*|The ID of the user to get details for. If provided
`username`|`string` *optional*|The username to filter users by. If provided

### Tool `list_prometheus_label_names`
List the label names in a Prometheus datasource

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`endRfc3339`|`string` *optional*|Optionally
`limit`|`integer` *optional*|Optionally
`matches`|`array` *optional*|Optionally
`startRfc3339`|`string` *optional*|Optionally

### Tool `list_prometheus_label_values`
Get the values of a label in Prometheus

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`labelName`|`string`|The name of the label to query
`endRfc3339`|`string` *optional*|Optionally
`limit`|`integer` *optional*|Optionally
`matches`|`array` *optional*|Optionally
`startRfc3339`|`string` *optional*|Optionally

### Tool `list_prometheus_metric_metadata`
List Prometheus metric metadata

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`limit`|`integer` *optional*|The maximum number of metrics to return
`limitPerMetric`|`integer` *optional*|The maximum number of metrics to return per metric
`metric`|`string` *optional*|The metric to query

### Tool `list_prometheus_metric_names`
List metric names in a Prometheus datasource that match the given regex

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`limit`|`integer` *optional*|The maximum number of results to return
`page`|`integer` *optional*|The page number to return
`regex`|`string` *optional*|The regex to match against the metric names

### Tool `query_loki_logs`
Query and retrieve log entries or metric values from a Loki datasource using LogQL. Returns either log lines or numeric values with timestamps and labels. Use `query_loki_stats` first to check stream size, then `list_loki_label_names` and `list_loki_label_values` to verify labels exist. Supports full LogQL syntax including both log queries and metric queries (e.g., rate, count_over_time).

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`logql`|`string`|The LogQL query to execute against Loki. This can be a simple label matcher or a complex query with filters
`direction`|`string` *optional*|Optionally
`endRfc3339`|`string` *optional*|Optionally
`limit`|`integer` *optional*|Optionally
`startRfc3339`|`string` *optional*|Optionally

### Tool `query_loki_stats`
Query statistics about log streams in a Loki datasource, using LogQL selectors to select streams

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`logql`|`string`|The LogQL matcher expression to execute. This parameter only accepts label matcher expressions and does not support full LogQL queries. Line filters
`endRfc3339`|`string` *optional*|Optionally
`startRfc3339`|`string` *optional*|Optionally

### Tool `query_prometheus`
Query Prometheus using a range or instant request

Parameter|Type|Description
-|-|-
`datasourceUid`|`string`|The UID of the datasource to query
`expr`|`string`|The PromQL expression to query
`startRfc3339`|`string`|The start time in RFC3339 format
`endRfc3339`|`string` *optional*|The end time in RFC3339 format. Required if queryType is 'range'
`queryType`|`string` *optional*|The type of query to use. Either 'range' or 'instant'
`stepSeconds`|`integer` *optional*|The time series step size in seconds. Required if queryType is 'range'

### Tool `search_dashboards`
Search for dashboards

Parameter|Type|Description
-|-|-
`query`|`string` *optional*|The query to search for

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
