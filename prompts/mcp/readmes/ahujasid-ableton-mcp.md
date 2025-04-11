# ahujasid-ableton-mcp MCP Server



[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [ahujasid](https://github.com/ahujasid) |
| **Repository** | https://github.com/ahujasid/ableton-mcp |
| **Dockerfile** | https://github.com/ahujasid/ableton-mcp/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | MIT License |

## Tools Summary

 1. **`add_notes_to_clip`**: Add MIDI notes to a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip
    - notes: List of note dictionaries, each with pitch, start_time, duration, velocity, and mute
 1. **`create_clip`**: Create a new MIDI clip in the specified track and clip slot.

    Parameters:
    - track_index: The index of the track to create the clip in
    - clip_index: The index of the clip slot to create the clip in
    - length: The length of the clip in beats (default: 4.0)
 1. **`create_midi_track`**: Create a new MIDI track in the Ableton session.

    Parameters:
    - index: The index to insert the track at (-1 = end of list)
 1. **`fire_clip`**: Start playing a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip
 1. **`get_browser_items_at_path`**: Get browser items at a specific path in Ableton's browser.

    Parameters:
    - path: Path in the format "category/folder/subfolder"
            where category is one of the available browser categories in Ableton
 1. **`get_browser_tree`**: Get a hierarchical tree of browser categories from Ableton.

    Parameters:
    - category_type: Type of categories to get ('all', 'instruments', 'sounds', 'drums', 'audio_effects', 'midi_effects')
 1. **`get_session_info`**: Get detailed information about the current Ableton session
 1. **`get_track_info`**: Get detailed information about a specific track in Ableton.

    Parameters:
    - track_index: The index of the track to get information about
 1. **`load_drum_kit`**: Load a drum rack and then load a specific drum kit into it.

    Parameters:
    - track_index: The index of the track to load on
    - rack_uri: The URI of the drum rack to load (e.g., 'Drums/Drum Rack')
    - kit_path: Path to the drum kit inside the browser (e.g., 'drums/acoustic/kit1')
 1. **`load_instrument_or_effect`**: Load an instrument or effect onto a track using its URI.

    Parameters:
    - track_index: The index of the track to load the instrument on
    - uri: The URI of the instrument or effect to load (e.g., 'query:Synths#Instrument%20Rack:Bass:FileId_5116')
 1. **`set_clip_name`**: Set the name of a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip
    - name: The new name for the clip
 1. **`set_tempo`**: Set the tempo of the Ableton session.

    Parameters:
    - tempo: The new tempo in BPM
 1. **`set_track_name`**: Set the name of a track.

    Parameters:
    - track_index: The index of the track to rename
    - name: The new name for the track
 1. **`start_playback`**: Start playing the Ableton session.
 1. **`stop_clip`**: Stop playing a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip
 1. **`stop_playback`**: Stop playing the Ableton session.

## Tools

### Tool: **`add_notes_to_clip`**

Add MIDI notes to a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip
    - notes: List of note dictionaries, each with pitch, start_time, duration, velocity, and mute

| Parameter | Type | Description |
| - | - | - |
| `clip_index` | `integer` |  |
| `notes` | `array` |  |
| `track_index` | `integer` |  |

### Tool: **`create_clip`**

Create a new MIDI clip in the specified track and clip slot.

    Parameters:
    - track_index: The index of the track to create the clip in
    - clip_index: The index of the clip slot to create the clip in
    - length: The length of the clip in beats (default: 4.0)

| Parameter | Type | Description |
| - | - | - |
| `clip_index` | `integer` |  |
| `track_index` | `integer` |  |
| `length` | `number` *optional* |  |

### Tool: **`create_midi_track`**

Create a new MIDI track in the Ableton session.

    Parameters:
    - index: The index to insert the track at (-1 = end of list)

| Parameter | Type | Description |
| - | - | - |
| `index` | `integer` *optional* |  |

### Tool: **`fire_clip`**

Start playing a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip

| Parameter | Type | Description |
| - | - | - |
| `clip_index` | `integer` |  |
| `track_index` | `integer` |  |

### Tool: **`get_browser_items_at_path`**

Get browser items at a specific path in Ableton's browser.

    Parameters:
    - path: Path in the format "category/folder/subfolder"
            where category is one of the available browser categories in Ableton

| Parameter | Type | Description |
| - | - | - |
| `path` | `string` |  |

### Tool: **`get_browser_tree`**

Get a hierarchical tree of browser categories from Ableton.

    Parameters:
    - category_type: Type of categories to get ('all', 'instruments', 'sounds', 'drums', 'audio_effects', 'midi_effects')

| Parameter | Type | Description |
| - | - | - |
| `category_type` | `string` *optional* |  |

### Tool: **`get_session_info`**

Get detailed information about the current Ableton session

### Tool: **`get_track_info`**

Get detailed information about a specific track in Ableton.

    Parameters:
    - track_index: The index of the track to get information about

| Parameter | Type | Description |
| - | - | - |
| `track_index` | `integer` |  |

### Tool: **`load_drum_kit`**

Load a drum rack and then load a specific drum kit into it.

    Parameters:
    - track_index: The index of the track to load on
    - rack_uri: The URI of the drum rack to load (e.g., 'Drums/Drum Rack')
    - kit_path: Path to the drum kit inside the browser (e.g., 'drums/acoustic/kit1')

| Parameter | Type | Description |
| - | - | - |
| `kit_path` | `string` |  |
| `rack_uri` | `string` |  |
| `track_index` | `integer` |  |

### Tool: **`load_instrument_or_effect`**

Load an instrument or effect onto a track using its URI.

    Parameters:
    - track_index: The index of the track to load the instrument on
    - uri: The URI of the instrument or effect to load (e.g., 'query:Synths#Instrument%20Rack:Bass:FileId_5116')

| Parameter | Type | Description |
| - | - | - |
| `track_index` | `integer` |  |
| `uri` | `string` |  |

### Tool: **`set_clip_name`**

Set the name of a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip
    - name: The new name for the clip

| Parameter | Type | Description |
| - | - | - |
| `clip_index` | `integer` |  |
| `name` | `string` |  |
| `track_index` | `integer` |  |

### Tool: **`set_tempo`**

Set the tempo of the Ableton session.

    Parameters:
    - tempo: The new tempo in BPM

| Parameter | Type | Description |
| - | - | - |
| `tempo` | `number` |  |

### Tool: **`set_track_name`**

Set the name of a track.

    Parameters:
    - track_index: The index of the track to rename
    - name: The new name for the track

| Parameter | Type | Description |
| - | - | - |
| `name` | `string` |  |
| `track_index` | `integer` |  |

### Tool: **`start_playback`**

Start playing the Ableton session.

### Tool: **`stop_clip`**

Stop playing a clip.

    Parameters:
    - track_index: The index of the track containing the clip
    - clip_index: The index of the clip slot containing the clip

| Parameter | Type | Description |
| - | - | - |
| `clip_index` | `integer` |  |
| `track_index` | `integer` |  |

### Tool: **`stop_playback`**

Stop playing the Ableton session.

## Use this MCP Server

```json
{
  "mcpServers": {
    "ahujasid-ableton-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/ahujasid-ableton-mcp"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/ahujasid-ableton-mcp -f Dockerfile https://github.com/ahujasid/ableton-mcp.git
```

