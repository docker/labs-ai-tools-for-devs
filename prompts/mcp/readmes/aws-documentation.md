# AWS Documentation MCP Server

Tools to access AWS documentation, search for content, and get recommendations.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/aws-documentation](https://hub.docker.com/repository/docker/mcp/aws-documentation)
**Author**|[awslabs](https://github.com/awslabs)
**Repository**|https://github.com/awslabs/mcp
**Dockerfile**|https://github.com/awslabs/mcp/blob/main/src/aws-documentation-mcp-server/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/aws-documentation)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/aws-documentation --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`read_documentation`|Fetch and convert an AWS documentation page to markdown format.|
`recommend`|Get content recommendations for an AWS documentation page.|
`search_documentation`|Search AWS documentation using the official AWS Documentation Search API.|

---
## Tools Details

#### Tool: **`read_documentation`**
Fetch and convert an AWS documentation page to markdown format.

## Usage

This tool retrieves the content of an AWS documentation page and converts it to markdown format.
For long documents, you can make multiple calls with different start_index values to retrieve
the entire content in chunks.

## URL Requirements

- Must be from the docs.aws.amazon.com domain
- Must end with .html

## Example URLs

- https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
- https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html

## Output Format

The output is formatted as markdown text with:
- Preserved headings and structure
- Code blocks for examples
- Lists and tables converted to markdown format

## Handling Long Documents

If the response indicates the document was truncated, you have several options:

1. **Continue Reading**: Make another call with start_index set to the end of the previous response
2. **Stop Early**: For very long documents (>30,000 characters), if you've already found the specific information needed, you can stop reading
Parameters|Type|Description
-|-|-
`url`|`string`|URL of the AWS documentation page to read
`max_length`|`integer` *optional*|Maximum number of characters to return.
`start_index`|`integer` *optional*|On return output starting at this character index, useful if a previous fetch was truncated and more content is required.

---
#### Tool: **`recommend`**
Get content recommendations for an AWS documentation page.

## Usage

This tool provides recommendations for related AWS documentation pages based on a given URL.
Use it to discover additional relevant content that might not appear in search results.

## Recommendation Types

The recommendations include four categories:

1. **Highly Rated**: Popular pages within the same AWS service
2. **New**: Recently added pages within the same AWS service - useful for finding newly released features
3. **Similar**: Pages covering similar topics to the current page
4. **Journey**: Pages commonly viewed next by other users

## When to Use

- After reading a documentation page to find related content
- When exploring a new AWS service to discover important pages
- To find alternative explanations of complex concepts
- To discover the most popular pages for a service
- To find newly released information by using a service's welcome page URL and checking the **New** recommendations

## Finding New Features

To find newly released information about a service:
1. Find any page belong to that service, typically you can try the welcome page
2. Call this tool with that URL
3. Look specifically at the **New** recommendation type in the results

## Result Interpretation

Each recommendation includes:
- url: The documentation page URL
- title: The page title
- context: A brief description (if available)
Parameters|Type|Description
-|-|-
`url`|`string`|URL of the AWS documentation page to get recommendations for

---
#### Tool: **`search_documentation`**
Search AWS documentation using the official AWS Documentation Search API.

## Usage

This tool searches across all AWS documentation for pages matching your search phrase.
Use it to find relevant documentation when you don't have a specific URL.

## Search Tips

- Use specific technical terms rather than general phrases
- Include service names to narrow results (e.g., "S3 bucket versioning" instead of just "versioning")
- Use quotes for exact phrase matching (e.g., "AWS Lambda function URLs")
- Include abbreviations and alternative terms to improve results

## Result Interpretation

Each result includes:
- rank_order: The relevance ranking (lower is more relevant)
- url: The documentation page URL
- title: The page title
- context: A brief excerpt or summary (if available)
Parameters|Type|Description
-|-|-
`search_phrase`|`string`|Search phrase to use
`limit`|`integer` *optional*|Maximum number of results to return

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "aws-documentation": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/aws-documentation"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
