# Devhub-cms MCP Server

DevHub CMS LLM integration through the Model Context Protocol

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
|**Author**|[devhub](https://github.com/devhub)
**Repository**|https://github.com/devhub/devhub-cms-mcp
**Dockerfile**|https://github.com/devhub/devhub-cms-mcp/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/devhub-cms)
**Licence**|

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_blog_post`|Create a new blog post|
`get_blog_post`|Get a single blog post|
`get_businesses`|Get all businesses within the DevHub account|
`get_hours_of_operation`|Get the hours of operation for a DevHub location|
`get_locations`|Get all locations for a business|
`get_nearest_location`|Get the nearest DevHub location|
`site_from_url`|Get the DevHub site ID from a URL.|
`update_blog_post`|Update a single blog post|
`update_hours`|Update the hours of operation for a DevHub location|
`upload_image`|Upload an image to the DevHub media gallery|

---
## Tools Details

#### Tool: **`create_blog_post`**
Create a new blog post
Parameters|Type|Description
-|-|-
`content`|`string`|HTML content of blog post. Should not include a <h1> tag, only h2+
`site_id`|`integer`|Website ID where the post will be published. Prompt the user for this ID.
`title`|`string`|Blog post title

---
#### Tool: **`get_blog_post`**
Get a single blog post
Parameters|Type|Description
-|-|-
`post_id`|`integer`|Blog post id

---
#### Tool: **`get_businesses`**
Get all businesses within the DevHub account

    Returns a list of businesses with the following fields:
    - id: Business ID that can be used in the other tools
    - business_name: Business name

    If only one business exists in the account, you can assume that the user wants to use that business for any business_id related tools.
#### Tool: **`get_hours_of_operation`**
Get the hours of operation for a DevHub location

    Returns a list of items representing days of the week

    Except for the special case formatting, this object is a list of 7 items which represent each day.

    Each day can can have one-four time ranges. For example, two time ranges denotes a "lunch-break". No time ranges denotes closed.

    Examples:
    9am-5pm [["09:00:00", "17:00:00"]]
    9am-12pm and 1pm-5pm [["09:00:00", "12:00:00"], ["13:00:00", "17:00:00"]]
    Closed - an empty list []
Parameters|Type|Description
-|-|-
`location_id`|`integer`|DevHub Location ID
`hours_type`|`string` *optional*|Defaults to 'primary' unless the user specifies a different type

---
#### Tool: **`get_locations`**
Get all locations for a business

    Returns a list of locations with the following fields:
    - id: Location ID that can be used in the other tools
    - location_name: Location name
    - location_url: Location URL in DevHub
    - street: Street address
    - city: City
    - state: State
    - country: Country
    - postal_code: Postal code
    - lat: Latitude
    - lon: Longitude
Parameters|Type|Description
-|-|-
`business_id`|`integer`|

---
#### Tool: **`get_nearest_location`**
Get the nearest DevHub location
Parameters|Type|Description
-|-|-
`business_id`|`integer`|DevHub Business ID associated with the location. Prompt the user for this ID
`latitude`|`number`|Latitude of the location
`longitude`|`number`|Longitude of the location

---
#### Tool: **`site_from_url`**
Get the DevHub site ID from a URL.

    Can prompt the user for the URL instead of passing a site_id.

    Returns details about the Site matches the URL that can be used in the other tools.
    - Site ID: ID of the DevHub site
    - Site URL: URL of the DevHub site
    - Site Location IDs: List of location IDs associated with the site
Parameters|Type|Description
-|-|-
`url`|`string`|URL of the DevHub site, all lowercase and ends with a slash

---
#### Tool: **`update_blog_post`**
Update a single blog post
Parameters|Type|Description
-|-|-
`post_id`|`integer`|Blog post ID
`content`|`string` *optional*|HTML content of blog post. Should not include a <h1> tag, only h2+
`title`|`string` *optional*|Blog post title

---
#### Tool: **`update_hours`**
Update the hours of operation for a DevHub location

    Send a list of items representing days of the week

    Except for the special case formatting, this object is a list of 7 items which represent each day.

    Each day can can have one-four time ranges. For example, two time ranges denotes a "lunch-break". No time ranges denotes closed.

    Examples:
    9am-5pm [["09:00:00", "17:00:00"]]
    9am-12pm and 1pm-5pm [["09:00:00", "12:00:00"], ["13:00:00", "17:00:00"]]
    Closed - an empty list []
Parameters|Type|Description
-|-|-
`location_id`|`integer`|DevHub Location ID
`new_hours`|`array`|Structured format of the new hours
`hours_type`|`string` *optional*|Defaults to 'primary' unless the user specifies a different type

---
#### Tool: **`upload_image`**
Upload an image to the DevHub media gallery

    Supports webp, jpeg and png images
Parameters|Type|Description
-|-|-
`base64_image_content`|`string`|Base 64 encoded content of the image file
`filename`|`string`|Filename including the extension

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "devhub-cms": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DEVHUB_BASE_URL",
        "-e",
        "DEVHUB_API_KEY",
        "-e",
        "DEVHUB_API_SECRET",
        "mcp/devhub-cms"
      ],
      "env": {
        "DEVHUB_BASE_URL": "https://yourbrand.cloudfrontend.net",
        "DEVHUB_API_KEY": "YOUR_KEY_HERE",
        "DEVHUB_API_SECRET": "YOUR_SECRET_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
