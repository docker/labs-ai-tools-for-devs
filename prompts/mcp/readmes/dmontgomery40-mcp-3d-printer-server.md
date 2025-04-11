# dmontgomery40-mcp-3d-printer-server MCP Server

Connects MCP to major 3D printer APIs (OctoPrint, Klipper, Duet, Repetier, Bambu, Prusa, Creality). Control prints, monitor status, and perform advanced STL operations like scaling, rotation, sectional editing, and base extension. Includes slicing and visualization.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [DMontgomery40](https://github.com/DMontgomery40) |
| **Repository** | https://github.com/DMontgomery40/mcp-3D-printer-server |
| **Dockerfile** | https://github.com/DMontgomery40/mcp-3D-printer-server/blob/refs/pull/2/merge/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** | GNU General Public License v2.0 |

## Tools Summary

 1. **`confirm_temperatures`**: Confirm temperature settings in a G-code file
 1. **`extend_stl_base`**: Extend the base of an STL file by a specified amount
 1. **`generate_stl_visualization`**: Generate an SVG visualization of an STL file from multiple angles
 1. **`get_printer_status`**: Get the current status of the 3D printer
 1. **`get_stl_info`**: Get detailed information about an STL file
 1. **`modify_stl_section`**: Apply a specific transformation to a selected section of an STL file
 1. **`process_and_print_stl`**: Process an STL file (extend base), slice it, confirm temperatures, and start printing
 1. **`rotate_stl`**: Rotate an STL model around specific axes
 1. **`scale_stl`**: Scale an STL model uniformly or along specific axes
 1. **`slice_stl`**: Slice an STL file to generate G-code
 1. **`translate_stl`**: Move an STL model along specific axes

## Tools

### Tool: **`confirm_temperatures`**

Confirm temperature settings in a G-code file

| Parameter | Type | Description |
| - | - | - |
| `gcode_path` | `string` | Path to the G-code file |
| `bed_temp` | `number` *optional* | Expected bed temperature |
| `extruder_temp` | `number` *optional* | Expected extruder temperature |

### Tool: **`extend_stl_base`**

Extend the base of an STL file by a specified amount

| Parameter | Type | Description |
| - | - | - |
| `extension_inches` | `number` | Amount to extend the base in inches |
| `stl_path` | `string` | Path to the STL file to modify |

### Tool: **`generate_stl_visualization`**

Generate an SVG visualization of an STL file from multiple angles

| Parameter | Type | Description |
| - | - | - |
| `stl_path` | `string` | Path to the STL file |
| `height` | `number` *optional* | Height of each view in pixels (default: 300) |
| `width` | `number` *optional* | Width of each view in pixels (default: 300) |

### Tool: **`get_printer_status`**

Get the current status of the 3D printer

| Parameter | Type | Description |
| - | - | - |
| `api_key` | `string` *optional* | API key for authentication (default: value from env) |
| `bambu_serial` | `string` *optional* | Serial number for Bambu Lab printers (default: value from env) |
| `bambu_token` | `string` *optional* | Access token for Bambu Lab printers (default: value from env) |
| `host` | `string` *optional* | Hostname or IP address of the printer (default: value from env) |
| `port` | `string` *optional* | Port of the printer API (default: value from env) |
| `type` | `string` *optional* | Type of printer management system (octoprint, klipper, duet, repetier, bambu, prusa, creality) (default: value from env) |

### Tool: **`get_stl_info`**

Get detailed information about an STL file

| Parameter | Type | Description |
| - | - | - |
| `stl_path` | `string` | Path to the STL file |

### Tool: **`modify_stl_section`**

Apply a specific transformation to a selected section of an STL file

| Parameter | Type | Description |
| - | - | - |
| `section` | `string` | Section to modify: 'top', 'bottom', 'center', or custom bounds |
| `stl_path` | `string` | Path to the STL file |
| `transformation_type` | `string` | Type of transformation to apply |
| `custom_max_x` | `number` *optional* | Maximum X for custom section bounds |
| `custom_max_y` | `number` *optional* | Maximum Y for custom section bounds |
| `custom_max_z` | `number` *optional* | Maximum Z for custom section bounds |
| `custom_min_x` | `number` *optional* | Minimum X for custom section bounds |
| `custom_min_y` | `number` *optional* | Minimum Y for custom section bounds |
| `custom_min_z` | `number` *optional* | Minimum Z for custom section bounds |
| `value_x` | `number` *optional* | Transformation value for X axis |
| `value_y` | `number` *optional* | Transformation value for Y axis |
| `value_z` | `number` *optional* | Transformation value for Z axis |

### Tool: **`process_and_print_stl`**

Process an STL file (extend base), slice it, confirm temperatures, and start printing

| Parameter | Type | Description |
| - | - | - |
| `extension_inches` | `number` | Amount to extend the base in inches |
| `stl_path` | `string` | Path to the STL file to process |
| `api_key` | `string` *optional* | API key for authentication (default: value from env) |
| `bed_temp` | `number` *optional* | Expected bed temperature |
| `extruder_temp` | `number` *optional* | Expected extruder temperature |
| `host` | `string` *optional* | Hostname or IP address of the printer (default: value from env) |
| `port` | `string` *optional* | Port of the printer API (default: value from env) |
| `type` | `string` *optional* | Type of printer management system (default: value from env) |

### Tool: **`rotate_stl`**

Rotate an STL model around specific axes

| Parameter | Type | Description |
| - | - | - |
| `stl_path` | `string` | Path to the STL file |
| `rotate_x` | `number` *optional* | Rotation around X-axis in degrees |
| `rotate_y` | `number` *optional* | Rotation around Y-axis in degrees |
| `rotate_z` | `number` *optional* | Rotation around Z-axis in degrees |

### Tool: **`scale_stl`**

Scale an STL model uniformly or along specific axes

| Parameter | Type | Description |
| - | - | - |
| `stl_path` | `string` | Path to the STL file |
| `scale_factor` | `number` *optional* | Uniform scaling factor to apply |
| `scale_x` | `number` *optional* | X-axis scaling factor (overrides scale_factor for X axis) |
| `scale_y` | `number` *optional* | Y-axis scaling factor (overrides scale_factor for Y axis) |
| `scale_z` | `number` *optional* | Z-axis scaling factor (overrides scale_factor for Z axis) |

### Tool: **`slice_stl`**

Slice an STL file to generate G-code

| Parameter | Type | Description |
| - | - | - |
| `stl_path` | `string` | Path to the STL file to slice |
| `slicer_path` | `string` *optional* | Path to the slicer executable (default: value from env) |
| `slicer_profile` | `string` *optional* | Profile to use for slicing (default: value from env) |
| `slicer_type` | `string` *optional* | Type of slicer to use (prusaslicer, cura, slic3r) (default: value from env) |

### Tool: **`translate_stl`**

Move an STL model along specific axes

| Parameter | Type | Description |
| - | - | - |
| `stl_path` | `string` | Path to the STL file |
| `translate_x` | `number` *optional* | Translation along X-axis in millimeters |
| `translate_y` | `number` *optional* | Translation along Y-axis in millimeters |
| `translate_z` | `number` *optional* | Translation along Z-axis in millimeters |

## Use this MCP Server

```json
{
  "mcpServers": {
    "dmontgomery40-mcp-3d-printer-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e"
        "BAMBU_SERIAL"
        "-e"
        "PRINTER_HOST"
        "-e"
        "PRINTER_TYPE"
        "-e"
        "BAMBU_TOKEN"
        "mcpcommunity/dmontgomery40-mcp-3d-printer-server"
      ],
      "env": {
        "BAMBU_SERIAL": "YOUR_BAMBU_SERIAL",
        "PRINTER_HOST": "REAL",
        "PRINTER_TYPE": "bambu",
        "BAMBU_TOKEN": "YOUR_BAMBU_TOKEN"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/dmontgomery40-mcp-3d-printer-server -f Dockerfile https://github.com/DMontgomery40/mcp-3D-printer-server.git#refs/pull/2/merge
```

