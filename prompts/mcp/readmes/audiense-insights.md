# Audiense Insights MCP Server

Audiense Insights MCP Server is a server based on the Model Context Protocol (MCP) that allows Claude and other MCP-compatible clients to interact with your Audiense Insights account.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/audiense-insights](https://hub.docker.com/repository/docker/mcp/audiense-insights)
**Author**|[AudienseCo](https://github.com/AudienseCo)
**Repository**|https://github.com/AudienseCo/mcp-audiense-insights
**Dockerfile**|https://github.com/AudienseCo/mcp-audiense-insights/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/audiense-insights)
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`compare-audience-influencers`|Compares the influencers of an audience with a baseline audience.|
`get-audience-content`|Retrieves audience content engagement details for a given audience.|
`get-audience-insights`|Retrieves aggregated insights for a given audience ID, providing statistical distributions across various attributes.|
`get-baselines`|Retrieves available baselines, optionally filtered by country.|
`get-categories`|Retrieves the list of available affinity categories that can be used as the categories parameter in the compare-audience-influencers tool.|
`get-report-info`|Retrieves detailed information about a specific intelligence report, including its status, segmentation type, audience size, segments, and access links.|
`get-reports`|Retrieves the list of Audiense insights reports owned by the authenticated user.|
`report-summary`|Generates a comprehensive summary of an Audiense report, including segment details, top insights, and influencers.|

---
## Tools Details

#### Tool: **`compare-audience-influencers`**
Compares the influencers of an audience with a baseline audience. The baseline is determined as follows: 
    If the selection was the full audience and a single country represents more than 50% of the audience, that country is used as the baseline.
    Otherwise, the Global baseline is applied. If the selection was a specific segment, the full audience is used as the baseline.
    Each influencer comparison includes: 
        - Affinity (%) - The level of alignment between the influencer and the audience. Baseline Affinity (%)
        - The influencer’s affinity within the baseline audience. Uniqueness Score
        - A measure of how distinct the influencer is within the selected audience compared to the baseline.
Parameters|Type|Description
-|-|-
`audience_influencers_id`|`string`|The ID of the audience influencers.
`baseline_audience_influencers_id`|`string`|The ID of the baseline audience influencers.
`bio_keyword`|`string` *optional*|Keyword to filter influencers by their biography.
`categories`|`array` *optional*|Filter influencers by categories.
`count`|`number` *optional*|Number of items per page (default: 200).
`countries`|`array` *optional*|Filter influencers by country ISO codes.
`cursor`|`number` *optional*|Cursor for pagination.
`entity_type`|`string` *optional*|Filter by entity type (person or brand).
`followers_max`|`number` *optional*|Maximum number of followers.
`followers_min`|`number` *optional*|Minimum number of followers.

---
#### Tool: **`get-audience-content`**
Retrieves audience content engagement details for a given audience.

This tool provides a detailed breakdown of the content an audience interacts with, including:
- **Liked Content**: Popular posts, top domains, top emojis, top hashtags, top links, top media, and a word cloud.
- **Shared Content**: Content that the audience shares, categorized similarly to liked content.
- **Influential Content**: Content from influential accounts that impact the audience, with similar categorization.

Each category contains:
- **popularPost**: List of the most engaged posts.
- **topDomains**: Most mentioned domains.
- **topEmojis**: Most used emojis.
- **topHashtags**: Most used hashtags.
- **topLinks**: Most shared links.
- **topMedia**: Media types shared and samples.
- **wordcloud**: Frequently used words.
Parameters|Type|Description
-|-|-
`audience_content_id`|`string`|The ID of the audience content to retrieve.

---
#### Tool: **`get-audience-insights`**
Retrieves aggregated insights for a given audience ID, providing statistical distributions across various attributes.
    Available insights include demographics (e.g., gender, age, country), behavioral traits (e.g., active hours, platform usage), psychographics (e.g., personality traits, interests), and socioeconomic factors (e.g., income, education status).
Parameters|Type|Description
-|-|-
`audience_insights_id`|`string`|The ID of the audience insights.
`insights`|`array` *optional*|Optional list of insight names to filter.

---
#### Tool: **`get-baselines`**
Retrieves available baselines, optionally filtered by country.
Parameters|Type|Description
-|-|-
`country`|`string` *optional*|ISO country code to filter by.

---
#### Tool: **`get-categories`**
Retrieves the list of available affinity categories that can be used as the categories parameter in the compare-audience-influencers tool.
#### Tool: **`get-report-info`**
Retrieves detailed information about a specific intelligence report, including its status, segmentation type, audience size, segments, and access links.
Parameters|Type|Description
-|-|-
`report_id`|`string`|The ID of the intelligence report.

---
#### Tool: **`get-reports`**
Retrieves the list of Audiense insights reports owned by the authenticated user.
#### Tool: **`report-summary`**
Generates a comprehensive summary of an Audiense report, including segment details, top insights, and influencers.
Parameters|Type|Description
-|-|-
`report_id`|`string`|The ID of the intelligence report to summarize.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "audiense-insights": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "AUDIENSE_CLIENT_ID",
        "-e",
        "AUDIENSE_CLIENT_SECRET",
        "-e",
        "TWITTER_BEARER_TOKEN",
        "mcp/audiense-insights"
      ],
      "env": {
        "AUDIENSE_CLIENT_ID": "your_client_id_here",
        "AUDIENSE_CLIENT_SECRET": "your_client_secret_here",
        "TWITTER_BEARER_TOKEN": "your_token_here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
