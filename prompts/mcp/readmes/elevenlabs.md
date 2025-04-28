# ElevenLabs MCP Server

The official ElevenLabs MCP server.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/elevenlabs](https://hub.docker.com/repository/docker/mcp/elevenlabs)
**Author**|[elevenlabs](https://github.com/elevenlabs)
**Repository**|https://github.com/elevenlabs/elevenlabs-mcp
**Dockerfile**|https://github.com/elevenlabs/elevenlabs-mcp/blob/refs/pull/17/merge/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/elevenlabs)
**Licence**|MIT License

## Available Tools
Tools provided by this Server|Short Description
-|-
`add_knowledge_base_to_agent`|Add a knowledge base to ElevenLabs workspace.|
`check_subscription`|Check the current subscription status.|
`create_agent`|Create a conversational AI agent with custom configuration.|
`create_voice_from_preview`|Add a generated voice to the voice library.|
`get_agent`|Get details about a specific conversational AI agent|
`get_voice`|Get details of a specific voice|
`isolate_audio`|Isolate audio from a file and save the output audio file to a given directory.|
`list_agents`|List all available conversational AI agents|
`list_phone_numbers`|List all phone numbers associated with the ElevenLabs account|
`make_outbound_call`|Make an outbound call via Twilio using an ElevenLabs agent.|
`play_audio`|Play an audio file.|
`search_voice_library`|Search for a voice across the entire ElevenLabs voice library.|
`search_voices`|Search for existing voices, a voice that has already been added to the user's ElevenLabs voice library.|
`speech_to_speech`|Transform audio from one voice to another using provided audio files.|
`speech_to_text`|Transcribe speech from an audio file and either save the output text file to a given directory or return the text to the client directly.|
`text_to_sound_effects`|Convert text description of a sound effect to sound effect with a given duration and save the output audio file to a given directory.|
`text_to_speech`|Convert text to speech with a given voice and save the output audio file to a given directory.|
`text_to_voice`|Create voice previews from a text prompt.|
`voice_clone`|Clone a voice using provided audio files.|

---
## Tools Details

#### Tool: **`add_knowledge_base_to_agent`**
Add a knowledge base to ElevenLabs workspace. Allowed types are epub, pdf, docx, txt, html.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`agent_id`|`string`|ID of the agent to add the knowledge base to.
`knowledge_base_name`|`string`|Name of the knowledge base.
`input_file_path`|`string` *optional*|Path to the file to add to the knowledge base.
`text`|`string` *optional*|Text to add to the knowledge base.
`url`|`string` *optional*|URL of the knowledge base.

---
#### Tool: **`check_subscription`**
Check the current subscription status. Could be used to measure the usage of the API.
#### Tool: **`create_agent`**
Create a conversational AI agent with custom configuration.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`first_message`|`string`|First message the agent will say i.e. "Hi, how can I help you today?"
`name`|`string`|Name of the agent
`system_prompt`|`string`|System prompt for the agent
`asr_quality`|`string` *optional*|Quality of the ASR. `high` or `low`.
`language`|`string` *optional*|ISO 639-1 language code for the agent
`llm`|`string` *optional*|LLM to use for the agent
`max_duration_seconds`|`integer` *optional*|Maximum duration of a conversation in seconds. Defaults to 600 seconds (10 minutes).
`max_tokens`|`string` *optional*|Maximum number of tokens to generate.
`model_id`|`string` *optional*|ID of the ElevenLabsmodel to use for the agent.
`optimize_streaming_latency`|`integer` *optional*|Optimize streaming latency. Range is 0 to 4.
`record_voice`|`boolean` *optional*|Whether to record the agent's voice.
`retention_days`|`integer` *optional*|Number of days to retain the agent's data.
`similarity_boost`|`number` *optional*|Similarity boost for the agent. Range is 0 to 1.
`stability`|`number` *optional*|Stability for the agent. Range is 0 to 1.
`temperature`|`number` *optional*|Temperature for the agent. The lower the temperature, the more deterministic the agent's responses will be. Range is 0 to 1.
`turn_timeout`|`integer` *optional*|Timeout for the agent to respond in seconds. Defaults to 7 seconds.
`voice_id`|`string` *optional*|ID of the voice to use for the agent

---
#### Tool: **`create_voice_from_preview`**
Add a generated voice to the voice library. Uses the voice ID from the `text_to_voice` tool.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`generated_voice_id`|`string`|
`voice_description`|`string`|
`voice_name`|`string`|

---
#### Tool: **`get_agent`**
Get details about a specific conversational AI agent
Parameters|Type|Description
-|-|-
`agent_id`|`string`|

---
#### Tool: **`get_voice`**
Get details of a specific voice
Parameters|Type|Description
-|-|-
`voice_id`|`string`|

---
#### Tool: **`isolate_audio`**
Isolate audio from a file and save the output audio file to a given directory.
    Directory is optional, if not provided, the output file will be saved to $HOME/Desktop.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`input_file_path`|`string`|
`output_directory`|`string` *optional*|

---
#### Tool: **`list_agents`**
List all available conversational AI agents
#### Tool: **`list_phone_numbers`**
List all phone numbers associated with the ElevenLabs account
#### Tool: **`make_outbound_call`**
Make an outbound call via Twilio using an ElevenLabs agent.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`agent_id`|`string`|The ID of the agent that will handle the call
`agent_phone_number_id`|`string`|The ID of the phone number to use for the call
`to_number`|`string`|The phone number to call (E.164 format: +1xxxxxxxxxx)

---
#### Tool: **`play_audio`**
Play an audio file. Supports WAV and MP3 formats.
Parameters|Type|Description
-|-|-
`input_file_path`|`string`|

---
#### Tool: **`search_voice_library`**
Search for a voice across the entire ElevenLabs voice library.
Parameters|Type|Description
-|-|-
`page`|`integer` *optional*|Page number to return (0-indexed)
`page_size`|`integer` *optional*|Number of voices to return per page (1-100)
`search`|`string` *optional*|Search term to filter voices by

---
#### Tool: **`search_voices`**
Search for existing voices, a voice that has already been added to the user's ElevenLabs voice library. 
    Searches in name, description, labels and category.
Parameters|Type|Description
-|-|-
`search`|`string` *optional*|Search term to filter voices by. Searches in name, description, labels and category.
`sort`|`string` *optional*|Which field to sort by. `created_at_unix` might not be available for older voices.
`sort_direction`|`string` *optional*|Sort order, either ascending or descending.

---
#### Tool: **`speech_to_speech`**
Transform audio from one voice to another using provided audio files.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`input_file_path`|`string`|
`output_directory`|`string` *optional*|
`voice_name`|`string` *optional*|

---
#### Tool: **`speech_to_text`**
Transcribe speech from an audio file and either save the output text file to a given directory or return the text to the client directly.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`input_file_path`|`string`|
`diarize`|`boolean` *optional*|Whether to diarize the audio file. If True, which speaker is currently speaking will be annotated in the transcription.
`language_code`|`string` *optional*|ISO 639-3 language code for transcription (default: "eng" for English)
`output_directory`|`string` *optional*|Directory where files should be saved.
`return_transcript_to_client_directly`|`boolean` *optional*|Whether to return the transcript to the client directly.
`save_transcript_to_file`|`boolean` *optional*|Whether to save the transcript to a file.

---
#### Tool: **`text_to_sound_effects`**
Convert text description of a sound effect to sound effect with a given duration and save the output audio file to a given directory.
    Directory is optional, if not provided, the output file will be saved to $HOME/Desktop.
    Duration must be between 0.5 and 5 seconds.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`text`|`string`|Text description of the sound effect
`duration_seconds`|`number` *optional*|Duration of the sound effect in seconds
`output_directory`|`string` *optional*|Directory where files should be saved.

---
#### Tool: **`text_to_speech`**
Convert text to speech with a given voice and save the output audio file to a given directory.
    Directory is optional, if not provided, the output file will be saved to $HOME/Desktop.
    Only one of voice_id or voice_name can be provided. If none are provided, the default voice will be used.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`text`|`string`|
`output_directory`|`string` *optional*|
`similarity_boost`|`number` *optional*|
`speed`|`number` *optional*|
`stability`|`number` *optional*|
`style`|`number` *optional*|
`use_speaker_boost`|`boolean` *optional*|
`voice_id`|`string` *optional*|
`voice_name`|`string` *optional*|

---
#### Tool: **`text_to_voice`**
Create voice previews from a text prompt. Creates three previews with slight variations. Saves the previews to a given directory. If no text is provided, the tool will auto-generate text.

    Voice preview files are saved as: voice_design_(generated_voice_id)_(timestamp).mp3

    Example file name: voice_design_Ya2J5uIa5Pq14DNPsbC1_20250403_164949.mp3

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`voice_description`|`string`|
`output_directory`|`string` *optional*|
`text`|`string` *optional*|

---
#### Tool: **`voice_clone`**
Clone a voice using provided audio files.

    ⚠️ COST WARNING: This tool makes an API call to ElevenLabs which may incur costs. Only use when explicitly requested by the user.
Parameters|Type|Description
-|-|-
`files`|`array`|
`name`|`string`|
`description`|`string` *optional*|

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "elevenlabs": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "ELEVENLABS_API_KEY",
        "mcp/elevenlabs"
      ],
      "env": {
        "ELEVENLABS_API_KEY": "<insert-your-api-key-here>"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
