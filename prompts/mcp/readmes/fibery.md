# Fibery MCP Server

Interact with your Fibery workspace.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/fibery](https://hub.docker.com/repository/docker/mcp/fibery)
**Author**|[Fibery-inc](https://github.com/Fibery-inc)
**Repository**|https://github.com/Fibery-inc/fibery-mcp-server
**Dockerfile**|https://github.com/Fibery-inc/fibery-mcp-server/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/fibery)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_entities_batch`|Create multiple Fibery entities at once with specified fields.|
`create_entity`|Create Fibery entity with specified fields.|
`current_date`|Get today's date in ISO 8601 format (YYYY-mm-dd.HH:MM:SS.000Z)|
`describe_database`|Get list of all fields (in format of 'Title [name]: type') in the selected Fibery database and for all related databases.|
`list_databases`|Get list of all databases (their names) in user's Fibery workspace (schema)|
`query_database`|Run any Fibery API command.|
`update_entity`|Update Fibery entity with specified fields.|

---
## Tools Details

#### Tool: **`create_entities_batch`**
Create multiple Fibery entities at once with specified fields.
Examples (note, that these databases are non-existent, use databases only from user's schema!):
Query: Create some features
Tool use:
{
    "database": "Product Management/Feature",
    "entities": [
        {
            "Product Management/Name": "New Feature 1",
            "Product Management/Description": "Description of the new feature 1",
            "workflow/state": "To Do" # notice how we use string literal for workflow field here
        },
        {
            "Product Management/Name": "New Feature 2",
            "Product Management/Description": "Description of the new feature 2",
            "workflow/state": "In Progress" # notice how we use string literal for workflow field here
        }
    ]
}
In case of successful execution, you will get links to created entities. Make sure to give the links to the user.
Parameters|Type|Description
-|-|-
`database`|`string`|Fibery Database where entities will be created.
`entities`|`object`|List of dictionaries that define what fields to set in format [{"FieldName": value}] (i.e. [{"Product Management/Name": "My new entity"}]).

---
#### Tool: **`create_entity`**
Create Fibery entity with specified fields.
Examples (note, that these databases are non-existent, use databases only from user's schema!):
Query: Create a feature
Tool use:
{
    "database": "Product Management/Feature",
    "entity": {
        "Product Management/Name": "New Feature",
        "Product Management/Description": "Description of the new feature",
        "workflow/state": "To Do" # notice how we use string literal for workflow field here
    }
}
In case of successful execution, you will get a link to created entity. Make sure to give that link to the user.
Parameters|Type|Description
-|-|-
`database`|`string`|Fibery Database where to create an entity.
`entity`|`object`|Dictionary that defines what fields to set in format {"FieldName": value} (i.e. {"Product Management/Name": "My new entity"}).

---
#### Tool: **`current_date`**
Get today's date in ISO 8601 format (YYYY-mm-dd.HH:MM:SS.000Z)
#### Tool: **`describe_database`**
Get list of all fields (in format of 'Title [name]: type') in the selected Fibery database and for all related databases.
Parameters|Type|Description
-|-|-
`database_name`|`string`|Database name as defined in Fibery schema

---
#### Tool: **`list_databases`**
Get list of all databases (their names) in user's Fibery workspace (schema)
#### Tool: **`query_database`**
Run any Fibery API command. This gives tremendous flexibility, but requires a bit of experience with the low-level Fibery API. In case query succeeded, return value contains a list of records with fields you specified in select. If request failed, will return detailed error message.
Examples (note, that these databases are non-existent, use databases only from user's schema!):
Query: What newly created Features do we have for the past 2 months?
Tool use:
{
    "q_from": "Dev/Feature",
    "q_select": {
        "Name": ["Dev/Name"],
        "Public Id": ["fibery/public-id"],
        "Creation Date": ["fibery/creation-date"]
    },
    "q_where": [">", ["fibery/creation-date"], "$twoMonthsAgo"],
    "q_order_by": {"fibery/creation-date": "q/desc"},
    "q_limit": 100,
    "q_offset": 0,
    "q_params": {
        $twoMonthsAgo: "2025-01-16T00:00:00.000Z"
    }
}

Query: What Admin Tasks for the past week are Approval or Done?
Tool use:
{
    "q_from": "Administrative/Admin Task",
    "q_select": {
        "Name": ["Administrative/Name"],
        "Public Id": ["fibery/public-id"],
        "Creation Date": ["fibery/creation-date"],
        "State": ["workflow/state", "enum/name"]
    },
    "q_where": [
        "q/and", # satisfy time AND states condition
            [">", ["fibery/creation-date"], "$oneWeekAgo"],
            [
                "q/or", # nested or, since entity can be in either of these states
                    ["=", ["workflow/state", "enum/name"], "$state1"],
                    ["=", ["workflow/state", "enum/name"], "$state2"]
            ]
    ],
    "q_order_by": {"fibery/creation-date": "q/desc"},
    "q_limit": 100,
    "q_offset": 0,
    "q_params": { # notice that parameters used in "where" are always passed in params!
        $oneWeekAgo: "2025-03-07T00:00:00.000Z",
        $state1: "Approval",
        $state2: "Done"
    }
}

Query: What Admin Tasks for the past week are Approval or Done?
Tool use:
{
    "q_from": "Administrative/Admin Task",
    "q_select": {
        "State": ["workflow/state", "enum/name"],
        "Public Id": ["fibery/public-id"],
        "Creation Date": ["fibery/creation-date"],
        "Modification Date": ["fibery/modification-date"],
        "Deadline": ["Administrative/Deadline"],
        "Group": ["Administrative/Group", "Administrative/name"],
        "Name": ["Administrative/Name"],
        "Priority": ["Administrative/Priority_Administrative/Admin Task", "enum/name"]
    },
    "q_where": ["!=", ["workflow/state", "workflow/Final"], "$stateType"], # Administrative/Admin Task is not "Finished" yet
    "q_order_by": {"fibery/creation-date": "q/desc"},
    "q_limit": 100,
    "q_offset": 0,
    "q_params: {
        "$stateType": true
    }
}

Query: Summarize acc contacts with public id 1.
Tool use:
{
    "q_from": "Accounting/Acc Contacts",
    "q_select": {
        "Name": ["Accounting/Name"],
        "Public Id": ["fibery/public-id"],
        "Creation Date": ["fibery/creation-date"],
        "Description": ["Accounting/Description"]
    },
    "q_where": ["=", ["fibery/public-id"], "$publicId"],
    "q_limit": 1,
    "q_params": {
        $publicId: "1",
    }
}
Parameters|Type|Description
-|-|-
`q_from`|`string`|Specifies the entity type in "Space/Type" format (e.g., "Product Management/feature", "Product Management/Insight")
`q_select`|`object`|Defines what fields to retrieve. Can include:
  - Primitive fields using format {"AliasName": "FieldName"} (i.e. {"Name": "Product Management/Name"})
  - Related entity fields using format {"AliasName": ["Related entity", "related entity field"]} (i.e. {"Secret": ["Product Management/Description", "Collaboration~Documents/secret"]}). Careful, does not work with 1-* connection!
To work with 1-* relationships, you can use sub-querying: {"AliasName": {"q/from": "Related type", "q/select": {"AliasName 2": "fibery/id"}, "q/limit": 50}}
AliasName can be of any arbitrary value.
`q_limit`|`integer` *optional*|Number of results per page (defaults to 50). Maximum allowed value is 1000
`q_offset`|`integer` *optional*|Number of results to skip. Mainly used in combination with limit and orderBy for pagination.
`q_order_by`|`object` *optional*|List of sorting criteria in format {"field1": "q/asc", "field2": "q/desc"}
`q_params`|`object` *optional*|Dictionary of parameter values referenced in where using "$param" syntax. For example, {$fromDate: "2025-01-01"}
`q_where`|`object` *optional*|Filter conditions in format [operator, [field_path], value] or ["q/and"|"q/or", ...conditions]. Common usages:
- Simple comparison: ["=", ["field", "path"], "$param"]. You cannot pass value of $param directly in where clause. Use params object instead. Pay really close attention to it as it is not common practice, but that's how it works in our case!
- Logical combinations: ["q/and", ["<", ["field1"], "$param1"], ["=", ["field2"], "$param2"]]
- Available operators: =, !=, <, <=, >, >=, q/contains, q/not-contains, q/in, q/not-in

---
#### Tool: **`update_entity`**
Update Fibery entity with specified fields.
Examples (note, that these databases are non-existent, use databases only from user's schema!):
Query: Update a feature we talked about
Tool use:
{
    "database": "Product Management/Feature",
    "entity": {
        "fibery/id": "12345678-1234-5678-1234-567812345678",
        "Product Management/Name": "New Feature 2",
        "Product Management/Description": {"append": true, "content": "Notes: some notes"},
        "workflow/state": "In Progress"
    }
}
In case of successful execution, you will get a link to updated entity. Make sure to give that link to the user.
Parameters|Type|Description
-|-|-
`database`|`string`|Fibery Database where to update an entity.
`entity`|`object`|Dictionary that defines what fields to set in format {"FieldName": value} (i.e. {"Product Management/Name": "My new entity"}).
Exception are document fields. For them you must specify append (boolean, whether to append to current content) and content itself: {"Product Management/Description": {"append": true, "content": "Additional info"}}

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "fibery": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "FIBERY_HOST",
        "-e",
        "FIBERY_API_TOKEN",
        "mcp/fibery"
      ],
      "env": {
        "FIBERY_HOST": "your-domain.fibery.io",
        "FIBERY_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
