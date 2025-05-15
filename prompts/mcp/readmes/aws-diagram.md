# AWS Diagram MCP Server

Seamlessly create diagrams using the Python diagrams package DSL. This server allows you to generate AWS diagrams, sequence diagrams, flow diagrams, and class diagrams using Python code.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/aws-diagram](https://hub.docker.com/repository/docker/mcp/aws-diagram)
**Author**|[awslabs](https://github.com/awslabs)
**Repository**|https://github.com/awslabs/mcp
**Dockerfile**|https://github.com/awslabs/mcp/blob/main/src/aws-diagram-mcp-server/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/aws-diagram)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/aws-diagram --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`generate_diagram`|Generate a diagram from Python code using the diagrams package.|
`get_diagram_examples`|Get example code for different types of diagrams.|
`list_icons`|List available icons from the diagrams package, with optional filtering.|

---
## Tools Details

#### Tool: **`generate_diagram`**
Generate a diagram from Python code using the diagrams package.

    This tool accepts Python code as a string that uses the diagrams package DSL
    and generates a PNG diagram without displaying it. The code is executed with
    show=False to prevent automatic display.

    USAGE INSTRUCTIONS:
    Never import. Start writing code immediately with `with Diagram(` and use the icons you found with list_icons.
    1. First use get_diagram_examples to understand the syntax and capabilities
    2. Then use list_icons to discover all available icons. These are the only icons you can work with.
    3. You MUST use icon names exactly as they are in the list_icons response, case-sensitive.
    4. Write your diagram code following python diagrams examples. Do not import any additional icons or packages, the runtime already imports everything needed.
    5. Submit your code to this tool to generate the diagram
    6. The tool returns the path to the generated PNG file
    7. For complex diagrams, consider using Clusters to organize components
    8. Diagrams should start with a user or end device on the left, with data flowing to the right.

    CODE REQUIREMENTS:
    - Must include a Diagram() definition with appropriate parameters
    - Can use any of the supported diagram components (AWS, K8s, etc.)
    - Can include custom styling with Edge attributes (color, style)
    - Can use Cluster to group related components
    - Can use custom icons with the Custom class

    COMMON PATTERNS:
    - Basic: provider.service("label")
    - Connections: service1 >> service2 >> service3
    - Grouping: with Cluster("name"): [components]
    - Styling: service1 >> Edge(color="red", style="dashed") >> service2

    IMPORTANT FOR CLINE: Always send the current workspace directory when calling this tool!
    The workspace_dir parameter should be set to the directory where the user is currently working
    so that diagrams are saved to a location accessible to the user.

    Supported diagram types:
    - AWS architecture diagrams
    - Sequence diagrams
    - Flow diagrams
    - Class diagrams
    - Kubernetes diagrams
    - On-premises diagrams
    - Custom diagrams with custom nodes

    Returns:
        Dictionary with the path to the generated diagram and status information
Parameters|Type|Description
-|-|-
`code`|`string`|Python code using the diagrams package DSL. The runtime already imports everything needed so you can start immediately using `with Diagram(`
`filename`|`string` *optional*|The filename to save the diagram to. If not provided, a random name will be generated.
`timeout`|`integer` *optional*|The timeout for diagram generation in seconds. Default is 90 seconds.
`workspace_dir`|`string` *optional*|The user's current workspace directory. CRITICAL: Client must always send the current workspace directory when calling this tool! If provided, diagrams will be saved to a 'generated-diagrams' subdirectory.

---
#### Tool: **`get_diagram_examples`**
Get example code for different types of diagrams.

    This tool provides ready-to-use example code for various diagram types.
    Use these examples to understand the syntax and capabilities of the diagrams package
    before creating your own custom diagrams.

    USAGE INSTRUCTIONS:
    1. Select the diagram type you're interested in (or 'all' to see all examples)
    2. Study the returned examples to understand the structure and syntax
    3. Use these examples as templates for your own diagrams
    4. When ready, modify an example or write your own code and use generate_diagram

    EXAMPLE CATEGORIES:
    - aws: AWS cloud architecture diagrams (basic services, grouped workers, clustered web services, Bedrock)
    - sequence: Process and interaction flow diagrams
    - flow: Decision trees and workflow diagrams
    - class: Object relationship and inheritance diagrams
    - k8s: Kubernetes architecture diagrams
    - onprem: On-premises infrastructure diagrams
    - custom: Custom diagrams with custom icons
    - all: All available examples across categories

    Each example demonstrates different features of the diagrams package:
    - Basic connections between components
    - Grouping with Clusters
    - Advanced styling with Edge attributes
    - Different layout directions
    - Multiple component instances
    - Custom icons and nodes

    Parameters:
        diagram_type (str): Type of diagram example to return. Options: aws, sequence, flow, class, k8s, onprem, custom, all

    Returns:
        Dictionary with example code for the requested diagram type(s), organized by example name
Parameters|Type|Description
-|-|-
`diagram_type`|`string` *optional*|Type of diagram example to return. Options: aws, sequence, flow, class, k8s, onprem, custom, all

---
#### Tool: **`list_icons`**
List available icons from the diagrams package, with optional filtering.

    This tool dynamically inspects the diagrams package to find available
    providers, services, and icons that can be used in diagrams.

    USAGE INSTRUCTIONS:
    1. Call without filters to get a list of available providers
    2. Call with provider_filter to get all services and icons for that provider
    3. Call with both provider_filter and service_filter to get icons for a specific service

    Example workflow:
    - First call: list_icons() → Returns all available providers
    - Second call: list_icons(provider_filter="aws") → Returns all AWS services and icons
    - Third call: list_icons(provider_filter="aws", service_filter="compute") → Returns AWS compute icons

    This approach is more efficient than loading all icons at once, especially when you only need
    icons from specific providers or services.

    Returns:
        Dictionary with available providers, services, and icons organized hierarchically
Parameters|Type|Description
-|-|-
`provider_filter`|`string` *optional*|Filter icons by provider name (e.g., "aws", "gcp", "k8s")
`service_filter`|`string` *optional*|Filter icons by service name (e.g., "compute", "database", "network")

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "aws-diagram": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/aws-diagram"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
