# Triplewhale MCP Server

Triplewhale MCP Server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/triplewhale](https://hub.docker.com/repository/docker/mcp/triplewhale)
**Author**|[Triple-Whale](https://github.com/Triple-Whale)
**Repository**|https://github.com/Triple-Whale/mcp-server-triplewhale
**Dockerfile**|https://github.com/Triple-Whale/mcp-server-triplewhale/blob/master/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/triplewhale)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`moby`|<background>
  moby tool helps users access e-commerce performance data.|

---
## Tools Details

#### Tool: **`moby`**
<background>
  moby tool helps users access e-commerce performance data.
  the tool prompts the user to enter their **shopId**, which is then used for tool as input, shopId is must for this tool.

         </background>

  <response-handling>

  <response-schema>
  openapi: 3.1.0
info:
  title: Triple Whale GPT API
  description: Access e-commerce performance data using the Triple Whale Moby API.
  version: 1.0.0
servers:
  - url: https://api.triplewhale.com
    description: Production server
paths:
  /willy/moby-chat:
    post:
      operationId: answerMobyQuestion
      summary: Get an answer from the Triple Whale Moby API.
      description: Sends a user question to the API along with their shop ID and API key.
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/QuestionRequest"
      responses:
        "200":
          description: Successfully retrieved the answer.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SimplifiedMobyResponse"
        "400":
          description: Bad request (e.g., missing parameters).
        "403":
          description: Unauthorized, invalid API key.
        "500":
          description: Internal server error.
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
      description: User-provided API key in UUID format.
  schemas:
    QuestionRequest:
      type: object
      required:
        - shopId
        - question
      properties:
        shopId:
          type: string
          description: store ID
          example: example-store.com
        question:
          type: string
          description: The question to ask Triple Whale.
          example: What is my ROAS for Facebook campaigns in the last 60 days?
    SimplifiedMobyResponse:
      type: object
      properties:
        isError:
          type: boolean
          description: Indicates if the API request resulted in an error.
        error:
          type: string
          nullable: true
          description: Error message if `isError` is true.
        responses:
          type: array
          description: List of responses from the API.
          items:
            $ref: "#/components/schemas/SimplifiedResponse"
        assistantConclusion:
          type: string
          description: Final summary from the assistant.
    SimplifiedResponse:
      type: object
      properties:
        isError:
          type: boolean
        errorMsg:
          type: string
          nullable: true
        question:
          type: string
        answer:
          type: array
          description: The structured answer.
          items:
            type: object
            additionalProperties:
              oneOf:
                - type: string
                - type: number
                - type: "null"
        assistant:
          type: string

  </response-schema>


   The API returns a **SimplifiedMobyResponse** object structured as follows:
  ```ts
  export type SimplifiedResponse = {
    isError: boolean;
    errorMsg?: string;
    question: string;
    answer: Record<string, string | number | null>[];
    assistant: string;
  };

  export type SimplifiedMobyResponse = {
    isError: boolean;
    error?: string;
    responses: SimplifiedResponse[];
    assistantConclusion: string;
  };
  ```

- The tool parses the **responses** array and presents answers sequentially.
- If `isError` is `true` in any response, the entire message is considered an error, and the error message is displayed.
- The `assistantConclusion` is included at the end to summarize the results.


- **For each valid response:**
  - Show the **question**.
  - Present the **answer** data in a clear, structured format.
  - Mention that the data is available in the recommended visualization format (if provided in `assistant`).
  - If similar reports are suggested in the `assistant`, provide links.
  - Ask if the user needs further assistance using the assistantConclusion from the response.

  </response-handling>


  <error_handling>
 - If `isError: true`, display the error message to the user.
- If the API returns `403 Unauthorized`, inform the user: "Invalid credentials. Please check your settings."
- If the `shopId` is missing, prompt the user to enter it.
- For other errors, respond with: "Something went wrong. Please try again later."

If the API return 401 it means the API key is invalid, this means the api ket doesn't have access to the shop so just say that api key is expired or doesn't have access to the shop.
  </error_handling>
Parameters|Type|Description
-|-|-
`params`|`object`|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "triplewhale": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "TRIPLEWHALE_API_KEY",
        "mcp/triplewhale"
      ],
      "env": {
        "TRIPLEWHALE_API_KEY": "your-triplewhale-api-key-here"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
