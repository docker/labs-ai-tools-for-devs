# lara MCP Server

Connect to Lara Translate API, enabling powerful translation capabilities with support for language detection and context-aware translations.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Official Image |
| **Author** | [translated](https://github.com/translated) |
| **Repository** | https://github.com/translated/lara-mcp |
| **Dockerfile** | https://github.com/translated/lara-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`add_translation`**: Adds a translation to a translation memory in your Lara Translate account.
 1. **`check_import_status`**: Checks the status of a TMX file import job in your Lara Translate account.
 1. **`create_memory`**: Create a translation memory with a custom name in your Lara Translate account. Translation memories store pairs of source and target text segments (translation units) for reuse in future translations.
 1. **`delete_memory`**: Deletes a translation memory from your Lara Translate account.
 1. **`delete_translation`**: Deletes a translation from a translation memory from your Lara Translate account.
 1. **`import_tmx`**: Imports a TMX file into a translation memory in your Lara Translate account.
 1. **`list_languages`**: Lists all supported languages in your Lara Translate account.
 1. **`list_memories`**: Lists all translation memories in your Lara Translate account.
 1. **`translate`**: Translate text between languages with support for language detection, context-aware translations, and translation memories using Lara Translate.
 1. **`update_memory`**: Updates a translation memory in your Lara Translate account.

## Tools

### Tool: **`add_translation`**

Adds a translation to a translation memory in your Lara Translate account.

| Parameter | Type | Description |
| - | - | - |
| `id` | `array` | The ID or list of IDs where to save the translation unit. Format: mem_xyz123 |
| `sentence` | `string` | The source sentence |
| `source` | `string` | The source language code of the sentence, it MUST be a language supported by the system, use the list_languages tool to get a list of all the supported languages |
| `target` | `string` | The target language code of the translation, it MUST be a language supported by the system, use the list_languages tool to get a list of all the supported languages |
| `translation` | `string` | The translated sentence |
| `sentence_after` | `string` *optional* | The sentence after the source sentence to specify the context of the translation unit |
| `sentence_before` | `string` *optional* | The sentence before the source sentence to specify the context of the translation unit |
| `tuid` | `string` *optional* | Translation Unit unique identifier |

### Tool: **`check_import_status`**

Checks the status of a TMX file import job in your Lara Translate account.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the import job |

### Tool: **`create_memory`**

Create a translation memory with a custom name in your Lara Translate account. Translation memories store pairs of source and target text segments (translation units) for reuse in future translations.

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` | The name of the new memory, it should be short and generic, like 'catch_phrases' or 'brand_names' |
| `external_id` | `string` *optional* | The ID of the memory to be imported from MyMemory. Use this to initialize the memory with external content. Format: ext_my_[MyMemory ID] |

### Tool: **`delete_memory`**

Deletes a translation memory from your Lara Translate account.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The unique identifier of the memory to update. Format: mem_xyz123 |

### Tool: **`delete_translation`**

Deletes a translation from a translation memory from your Lara Translate account.

| Parameter | Type | Description |
| - | - | - |
| `id` | `array` | The ID or list of IDs where to delete the translation unit from. Format: mem_xyz123 |
| `sentence` | `string` | The source sentence |
| `source` | `string` | The source language code of the sentence |
| `target` | `string` | The target language code of the translation |
| `translation` | `string` | The translated sentence |
| `sentence_after` | `string` *optional* | The sentence after the source sentence to specify the context of the translation unit |
| `sentence_before` | `string` *optional* | The sentence before the source sentence to specify the context of the translation unit |
| `tuid` | `string` *optional* | Translation Unit unique identifier |

### Tool: **`import_tmx`**

Imports a TMX file into a translation memory in your Lara Translate account.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The ID of the memory to update. Format: mem_xyz123. |
| `gzip` | `boolean` *optional* | Indicates if the file is a compressed .gz file |
| `tmx_content` | `string` *optional* | The content of the tmx file to upload. Don't provide this if you choose to use tmx_url. |
| `tmx_url` | `string` *optional* | A URL to the tmx file to upload. Don't provide this if you choose to use tmx_content. |

### Tool: **`list_languages`**

Lists all supported languages in your Lara Translate account.

### Tool: **`list_memories`**

Lists all translation memories in your Lara Translate account.

### Tool: **`translate`**

Translate text between languages with support for language detection, context-aware translations, and translation memories using Lara Translate.

| Parameter | Type | Description |
| - | - | - |
| `target` | `string` | The target language code (e.g., 'it-IT' for Italian). This specifies the language you want the text translated into. |
| `text` | `array` | An array of text blocks to translate. Each block contains a text string and a boolean indicating whether it should be translated. This allows for selective translation where some text blocks can be preserved in their original form while others are translated. |
| `adapt_to` | `array` *optional* | A list of translation memory IDs for adapting the translation. |
| `context` | `string` *optional* | Additional context string to improve translation quality (e.g., 'This is a legal document' or 'Im talking with a doctor'). This helps the translation system better understand the domain. |
| `instructions` | `array` *optional* | A list of instructions to adjust the network’s behavior regarding the output (e.g., 'Use a formal tone'). |
| `source` | `string` *optional* | The source language code (e.g., 'en-EN' for English). If not specified, the system will attempt to detect it automatically. If you have a hint about the source language, you should specify it in the source_hint field. |
| `source_hint` | `string` *optional* | Used to guide language detection. Specify this when the source language is uncertain to improve detection accuracy. |

### Tool: **`update_memory`**

Updates a translation memory in your Lara Translate account.

| Parameter | Type | Description |
| - | - | - |
| `id` | `string` | The unique identifier of the memory to update. Format: mem_xyz123 |
| `name` | `string` | The new name for the memory |

## Use this MCP Server

```json
{
  "mcpServers": {
    "lara": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "LARA_ACCESS_KEY_ID"
        "-e"
        "LARA_ACCESS_KEY_SECRET"
        "mcp/lara"
      ],
      "env": {
        "LARA_ACCESS_KEY_ID": "YOUR_LARA_ACCESS_KEY_ID",
        "LARA_ACCESS_KEY_SECRET": "YOUR_LARA_ACCESS_KEY_SECRET"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcp/lara -f Dockerfile https://github.com/translated/lara-mcp.git
```

