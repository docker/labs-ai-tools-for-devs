# Dappier MCP Server

Enable fast, free real-time web search and access premium data from trusted media brands—news, financial markets, sports, entertainment, weather, and more. Build powerful AI agents with Dappier.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/dappier](https://hub.docker.com/repository/docker/mcp/dappier)
**Author**|[DappierAI](https://github.com/DappierAI)
**Repository**|https://github.com/dappierai/dappier-mcp
**Dockerfile**|https://github.com/dappierai/dappier-mcp/blob/staging/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/dappier)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`dappier_ai_recommendations`|Fetch AI-powered recommendations from Dappier by processing the provided query with a selected data model that tailors results to specific interests.|
`dappier_real_time_search`|Retrieve real-time search data from Dappier by processing an AI model that supports two key capabilities:|

---
## Tools Details

#### Tool: **`dappier_ai_recommendations`**
Fetch AI-powered recommendations from Dappier by processing the provided query with a selected data model that tailors results to specific interests.

    - **Sports News (dm_01j0pb465keqmatq9k83dthx34):**  
    Get real-time news, updates, and personalized content from top sports sources.

    - **Lifestyle News (dm_01j0q82s4bfjmsqkhs3ywm3x6y):**  
    Access current lifestyle updates, analysis, and insights from leading lifestyle publications.

    - **iHeartDogs AI (dm_01j1sz8t3qe6v9g8ad102kvmqn):**  
    Tap into a dog care expert with access to thousands of articles covering pet health, behavior, grooming, and ownership.

    - **iHeartCats AI (dm_01j1sza0h7ekhaecys2p3y0vmj):**  
    Utilize a cat care specialist that provides comprehensive content on cat health, behavior, and lifestyle.

    - **GreenMonster (dm_01j5xy9w5sf49bm6b1prm80m27):**  
    Receive guidance for making conscious and compassionate choices benefiting people, animals, and the planet.

    - **WISH-TV AI (dm_01jagy9nqaeer9hxx8z1sk1jx6):**  
    Get recommendations covering sports, breaking news, politics, multicultural updates, and more.

    Based on the chosen `data_model_id`, the tool processes the input query and returns a formatted summary including article titles, summaries, images, source URLs, publication dates, and relevance scores.
Parameters|Type|Description
-|-|-
`data_model_id`|`string`|The data model ID to use for recommendations.

Available Data Models:
- dm_01j0pb465keqmatq9k83dthx34: (Sports News) Real-time news, updates, and personalized content from top sports sources like Sportsnaut, Forever Blueshirts, Minnesota Sports Fan, LAFB Network, Bounding Into Sports and Ringside Intel.
- dm_01j0q82s4bfjmsqkhs3ywm3x6y: (Lifestyle News) Real-time updates, analysis, and personalized content from top sources like The Mix, Snipdaily, Nerdable and Familyproof.
- dm_01j1sz8t3qe6v9g8ad102kvmqn: (iHeartDogs AI) A dog care expert with access to thousands of articles on health, behavior, lifestyle, grooming, ownership, and more from the industry-leading pet community iHeartDogs.com.
- dm_01j1sza0h7ekhaecys2p3y0vmj: (iHeartCats AI) A cat care expert with access to thousands of articles on health, behavior, lifestyle, grooming, ownership, and more from the industry-leading pet community iHeartCats.com.
- dm_01j5xy9w5sf49bm6b1prm80m27: (GreenMonster) A helpful guide to making conscious and compassionate choices that benefit people, animals, and the planet.
- dm_01jagy9nqaeer9hxx8z1sk1jx6: (WISH-TV AI) Covers sports, politics, breaking news, multicultural news, Hispanic language content, entertainment, health, and education.


`query`|`string`|The input string for AI-powered content recommendations.
`num_articles_ref`|`integer` *optional*|Minimum number of articles to return from the reference domain.
`ref`|`string` *optional*|The site domain where recommendations should be prioritized.
`search_algorithm`|`string` *optional*|The search algorithm to use for retrieving articles.
`similarity_top_k`|`integer` *optional*|Number of top similar articles to retrieve based on semantic similarity.

---
#### Tool: **`dappier_real_time_search`**
Retrieve real-time search data from Dappier by processing an AI model that supports two key capabilities:

    - Real-Time Web Search:  
    Access the latest news, stock market data, weather, travel information, deals, and more using model `am_01j06ytn18ejftedz6dyhz2b15`.  
    Use this model when no stock ticker symbol is provided.

    - Stock Market Data:  
    Retrieve real-time financial news, stock prices, and trade updates using model `am_01j749h8pbf7ns8r1bq9s2evrh`.  
    Use this model only when a stock ticker symbol is provided.

    Based on the provided `ai_model_id`, the tool selects the appropriate model and returns search results.
Parameters|Type|Description
-|-|-
`ai_model_id`|`string`|The AI model ID to use for the query.

Available AI Models:
- am_01j06ytn18ejftedz6dyhz2b15: (Real-Time Data) Access real-time Google web search results, including the latest news, stock market data, news, weather, travel, deals, and more. Use this model when no stock ticker symbol is provided.
- am_01j749h8pbf7ns8r1bq9s2evrh: (Stock Market Data) Access real-time financial news, stock prices, and trades from Polygon.io, with AI-powered insights and up-to-the-minute updates. Use this model only when a stock ticker symbol is provided.


`query`|`string`|The search query to retrieve real-time information.

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "dappier": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DAPPIER_API_KEY",
        "mcp/dappier"
      ],
      "env": {
        "DAPPIER_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
