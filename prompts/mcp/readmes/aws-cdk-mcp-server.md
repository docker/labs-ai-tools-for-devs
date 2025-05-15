# AWS CDK MCP Server

AWS Cloud Development Kit (CDK) best practices, infrastructure as code patterns, and security compliance with CDK Nag.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/aws-cdk-mcp-server](https://hub.docker.com/repository/docker/mcp/aws-cdk-mcp-server)
**Author**|[awslabs](https://github.com/awslabs)
**Repository**|https://github.com/awslabs/mcp
**Dockerfile**|https://github.com/awslabs/mcp/blob/main/src/cdk-mcp-server/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/aws-cdk-mcp-server)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/aws-cdk-mcp-server --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`CDKGeneralGuidance`|Use this tool to get prescriptive CDK advice for building applications on AWS.|
`CheckCDKNagSuppressions`|Check if CDK code contains Nag suppressions that require human review.|
`ExplainCDKNagRule`|Explain a specific CDK Nag rule with AWS Well-Architected guidance.|
`GenerateBedrockAgentSchema`|Generate OpenAPI schema for Bedrock Agent Action Groups from a file.|
`GetAwsSolutionsConstructPattern`|Search and discover AWS Solutions Constructs patterns.|
`LambdaLayerDocumentationProvider`|Provide documentation sources for Lambda layers.|
`SearchGenAICDKConstructs`|Search for GenAI CDK constructs by name or type.|

---
## Tools Details

#### Tool: **`CDKGeneralGuidance`**
Use this tool to get prescriptive CDK advice for building applications on AWS.
#### Tool: **`CheckCDKNagSuppressions`**
Check if CDK code contains Nag suppressions that require human review.

    Scans TypeScript/JavaScript code for NagSuppressions usage to ensure security
    suppressions receive proper human oversight and justification.
Parameters|Type|Description
-|-|-
`code`|`string` *optional*|CDK code to analyze (TypeScript/JavaScript)
`file_path`|`string` *optional*|Path to a file containing CDK code to analyze

---
#### Tool: **`ExplainCDKNagRule`**
Explain a specific CDK Nag rule with AWS Well-Architected guidance.

    CDK Nag is a crucial tool for ensuring your CDK applications follow AWS security best practices.

    Basic implementation:
    ```typescript
    import { App } from 'aws-cdk-lib';
    import { AwsSolutionsChecks } from 'cdk-nag';

    const app = new App();
    // Create your stack
    const stack = new MyStack(app, 'MyStack');
    // Apply CDK Nag
    AwsSolutionsChecks.check(app);
    ```

    Optional integration patterns:

    1. Using environment variables:
    ```typescript
    if (process.env.ENABLE_CDK_NAG === 'true') {
      AwsSolutionsChecks.check(app);
    }
    ```

    2. Using CDK context parameters:
    ```typescript
    3. Environment-specific application:
    ```typescript
    const environment = app.node.tryGetContext('environment') || 'development';
    if (['production', 'staging'].includes(environment)) {
      AwsSolutionsChecks.check(stack);
    }
    ```

    For more information on specific rule packs:
    - Use resource `cdk-nag://rules/{rule_pack}` to get all rules for a specific pack
    - Use resource `cdk-nag://warnings/{rule_pack}` to get warnings for a specific pack
    - Use resource `cdk-nag://errors/{rule_pack}` to get errors for a specific pack
Parameters|Type|Description
-|-|-
`rule_id`|`string`|The CDK Nag rule ID (e.g., 'AwsSolutions-IAM4')

---
#### Tool: **`GenerateBedrockAgentSchema`**
Generate OpenAPI schema for Bedrock Agent Action Groups from a file.

    This tool converts a Lambda file with BedrockAgentResolver into a Bedrock-compatible
    OpenAPI schema. It uses a progressive approach to handle common issues:
    1. Direct import of the Lambda file
    2. Simplified version with problematic imports commented out
    3. Fallback script generation if needed
Parameters|Type|Description
-|-|-
`lambda_code_path`|`string`|Path to Python file containing BedrockAgentResolver app
`output_path`|`string`|Where to save the generated schema

---
#### Tool: **`GetAwsSolutionsConstructPattern`**
Search and discover AWS Solutions Constructs patterns.

    AWS Solutions Constructs are vetted architecture patterns that combine multiple
    AWS services to solve common use cases following AWS Well-Architected best practices.

    Key benefits:
    - Accelerated Development: Implement common patterns without boilerplate code
    - Best Practices Built-in: Security, reliability, and performance best practices
    - Reduced Complexity: Simplified interfaces for multi-service architectures
    - Well-Architected: Patterns follow AWS Well-Architected Framework principles

    When to use Solutions Constructs:
    - Implementing common architecture patterns (e.g., API + Lambda + DynamoDB)
    - You want secure defaults and best practices applied automatically
    - You need to quickly prototype or build production-ready infrastructure

    This tool provides metadata about patterns. For complete documentation,
    use the resource URI returned in the 'documentation_uri' field.
Parameters|Type|Description
-|-|-
`pattern_name`|`string` *optional*|Optional name of the specific pattern (e.g., 'aws-lambda-dynamodb')
`services`|`string` *optional*|Optional list of AWS services to search for patterns that use them

---
#### Tool: **`LambdaLayerDocumentationProvider`**
Provide documentation sources for Lambda layers.

    This tool returns information about where to find documentation for Lambda layers
    and instructs the MCP Client to fetch and process this documentation.
Parameters|Type|Description
-|-|-
`layer_type`|`string`|Type of layer ("generic" or "python")

---
#### Tool: **`SearchGenAICDKConstructs`**
Search for GenAI CDK constructs by name or type.

    The search is flexible and will match any of your search terms (OR logic).
    It handles common variations like singular/plural forms and terms with/without spaces.
    Content is fetched dynamically from GitHub to ensure the most up-to-date documentation.

    Examples:
    - "bedrock agent" - Returns all agent-related constructs
    - "knowledgebase vector" - Returns knowledge base constructs related to vector stores
    - "agent actiongroups" - Returns action groups for agents
    - "opensearch vector" - Returns OpenSearch vector constructs

    The search supports subdirectory content (like knowledge bases and their sections)
    and will find matches across all available content.
Parameters|Type|Description
-|-|-
`construct_type`|`string` *optional*|Optional filter by construct type ('bedrock', 'opensearchserverless', etc.)
`query`|`string` *optional*|Search term(s) to find constructs by name or description

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "aws-cdk-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/aws-cdk-mcp-server"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
