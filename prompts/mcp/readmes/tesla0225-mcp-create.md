# tesla0225-mcp-create MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [tesla0225](https://github.com/tesla0225) |
| **Repository** | https://github.com/tesla0225/mcp-create |
| **Dockerfile** | https://github.com/tesla0225/mcp-create/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`create-server-from-template`**: Create a new MCP server from a template.

  以下のテンプレートコードをベースに、ユーザーの要求に合わせたサーバーを実装してください。
  言語に応じて適切なテンプレートを選択し、必要に応じて機能を追加・変更してください。

  TypeScriptテンプレート:
  ```typescript
  import { Server } from "@modelcontextprotocol/sdk/server/index.js";
  import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
  import { 
    CallToolRequestSchema, 
    ListToolsRequestSchema 
  } from "@modelcontextprotocol/sdk/types.js";

  const server = new Server({
    name: "dynamic-test-server",
    version: "1.0.0"
  }, {
    capabilities: {
      tools: {}
    }
  });

  // ここでツールを実装してください
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [{
        name: "echo",
        description: "Echo back a message",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" }
          },
          required: ["message"]
        }
      }]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "echo") {
      // TypeScriptの型を適切に扱うため、型アサーションを使用
      const message = request.params.arguments.message as string;
      // または any を使う: const message: any = request.params.arguments.message;

      return {
        content: [
          {
            type: "text",
            text: `Echo: ${message}`
          }
        ]
      };
    }
    throw new Error("Tool not found");
  });

  // Server startup
  const transport = new StdioServerTransport();
  server.connect(transport);
  ```

  Pythonテンプレート:
  ```python
  import asyncio
  from mcp.server import Server
  from mcp.server.stdio import stdio_server

  app = Server("dynamic-test-server")

  @app.list_tools()
  async def list_tools():
      return [
          {
              "name": "echo",
              "description": "Echo back a message",
              "inputSchema": {
                  "type": "object",
                  "properties": {
                      "message": {"type": "string"}
                  },
                  "required": ["message"]
              }
          }
      ]

  @app.call_tool()
  async def call_tool(name, arguments):
      if name == "echo":
          return [{"type": "text", "text": f"Echo: {arguments.get('message')}"}]
      raise ValueError(f"Tool not found: {name}")

  async def main():
      async with stdio_server() as streams:
          await app.run(
              streams[0],
              streams[1],
              app.create_initialization_options()
          )

  if __name__ == "__main__":
      asyncio.run(main())
  ```

  注意事項：
  - TypeScript実装時は、引数の型を適切に扱うために型アサーション（as string）を使用するか、
    明示的に型を宣言してください（例：const value: string = request.params.arguments.someValue）。
  - 複雑な型を扱う場合は、interface や type を定義して型安全性を確保することをお勧めします。

  ユーザーの要求に応じて上記のテンプレートを参考にカスタマイズしてください。その際、基本的な構造を維持しつつ、ツール名や機能を変更できます。
 1. **`delete-server`**: Delete a server
 1. **`execute-tool`**: Execute a tool on a server
 1. **`get-server-tools`**: Get the tools available on a server
 1. **`list-servers`**: List all running servers

## Tools

### Tool: **`create-server-from-template`**

Create a new MCP server from a template.

  以下のテンプレートコードをベースに、ユーザーの要求に合わせたサーバーを実装してください。
  言語に応じて適切なテンプレートを選択し、必要に応じて機能を追加・変更してください。

  TypeScriptテンプレート:
  ```typescript
  import { Server } from "@modelcontextprotocol/sdk/server/index.js";
  import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
  import { 
    CallToolRequestSchema, 
    ListToolsRequestSchema 
  } from "@modelcontextprotocol/sdk/types.js";

  const server = new Server({
    name: "dynamic-test-server",
    version: "1.0.0"
  }, {
    capabilities: {
      tools: {}
    }
  });

  // ここでツールを実装してください
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [{
        name: "echo",
        description: "Echo back a message",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" }
          },
          required: ["message"]
        }
      }]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "echo") {
      // TypeScriptの型を適切に扱うため、型アサーションを使用
      const message = request.params.arguments.message as string;
      // または any を使う: const message: any = request.params.arguments.message;

      return {
        content: [
          {
            type: "text",
            text: `Echo: ${message}`
          }
        ]
      };
    }
    throw new Error("Tool not found");
  });

  // Server startup
  const transport = new StdioServerTransport();
  server.connect(transport);
  ```

  Pythonテンプレート:
  ```python
  import asyncio
  from mcp.server import Server
  from mcp.server.stdio import stdio_server

  app = Server("dynamic-test-server")

  @app.list_tools()
  async def list_tools():
      return [
          {
              "name": "echo",
              "description": "Echo back a message",
              "inputSchema": {
                  "type": "object",
                  "properties": {
                      "message": {"type": "string"}
                  },
                  "required": ["message"]
              }
          }
      ]

  @app.call_tool()
  async def call_tool(name, arguments):
      if name == "echo":
          return [{"type": "text", "text": f"Echo: {arguments.get('message')}"}]
      raise ValueError(f"Tool not found: {name}")

  async def main():
      async with stdio_server() as streams:
          await app.run(
              streams[0],
              streams[1],
              app.create_initialization_options()
          )

  if __name__ == "__main__":
      asyncio.run(main())
  ```

  注意事項：
  - TypeScript実装時は、引数の型を適切に扱うために型アサーション（as string）を使用するか、
    明示的に型を宣言してください（例：const value: string = request.params.arguments.someValue）。
  - 複雑な型を扱う場合は、interface や type を定義して型安全性を確保することをお勧めします。

  ユーザーの要求に応じて上記のテンプレートを参考にカスタマイズしてください。その際、基本的な構造を維持しつつ、ツール名や機能を変更できます。

| Parameter | Type | Description |
| - | - | - |
| `language` | `string` | The programming language for the template |
| `code` | `string` *optional* | カスタマイズしたサーバーコード。テンプレートを元に変更したコードを入力してください。省略した場合はデフォルトのテンプレートが使用されます。 |
| `dependencies` | `object` *optional* | 使用するライブラリとそのバージョン（例: { "axios": "^1.0.0" }） |

### Tool: **`delete-server`**

Delete a server

| Parameter | Type | Description |
| - | - | - |
| `serverId` | `string` | The ID of the server |

### Tool: **`execute-tool`**

Execute a tool on a server

| Parameter | Type | Description |
| - | - | - |
| `serverId` | `string` | The ID of the server |
| `toolName` | `string` | The name of the tool to execute |
| `args` | `object` *optional* | The arguments to pass to the tool |

### Tool: **`get-server-tools`**

Get the tools available on a server

| Parameter | Type | Description |
| - | - | - |
| `serverId` | `string` | The ID of the server |

### Tool: **`list-servers`**

List all running servers

## Use this MCP Server

```json
{
  "mcpServers": {
    "tesla0225-mcp-create": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/tesla0225-mcp-create"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/tesla0225-mcp-create -f Dockerfile https://github.com/tesla0225/mcp-create.git
```

