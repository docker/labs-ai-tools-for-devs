# JetBrains MCP Server

A model context protocol server to work with JetBrains IDEs: IntelliJ, PyCharm, WebStorm, etc. Also, works with Android Studio.

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

## Characteristics
Attribute|Details|
|-|-|
**Image Source**|Official Image
**Docker Image**|[mcp/jetbrains](https://hub.docker.com/repository/docker/mcp/jetbrains)
**Author**|[GannaChernyshova](https://github.com/GannaChernyshova)
**Repository**|https://github.com/GannaChernyshova/mcp-jetbrains
**Dockerfile**|https://github.com/GannaChernyshova/mcp-jetbrains/blob/main/Dockerfile
**Docker Image built by**|Docker Inc.
**Docker Scout Health Score**| ![Docker Scout Health Score](https://api.scout.docker.com/v1/policy/insights/org-image-score/badge/mcp/jetbrains)
**Verify Signature**|`COSIGN_REPOSITORY=mcp/signatures cosign verify mcp/jetbrains --key https://raw.githubusercontent.com/docker/keyring/refs/heads/main/public/mcp/latest.pub`
**Licence**|Apache License 2.0

## Available Tools
Tools provided by this Server|Short Description
-|-
`create_new_file_with_text`|Creates a new file at the specified path within the project directory and populates it with the provided text|
`execute_action_by_id`|Executes an action by its ID in JetBrains IDE editor|
`execute_terminal_command`|Executes a specified shell command in the IDE's integrated terminal|
`find_commit_by_message`|Searches for a commit based on the provided text or keywords in the project history|
`find_files_by_name_substring`|Searches for all files in the project whose names contain the specified substring|
`get_all_open_file_paths`|Lists full path relative paths to project root of all currently open files|
`get_all_open_file_texts`|Returns text of all currently open files in the JetBrains IDE editor|
`get_debugger_breakpoints`|Retrieves a list of all line breakpoints currently set in the project|
`get_file_text_by_path`|Retrieves the text content of a file using its path relative to project root|
`get_open_in_editor_file_path`|Retrieves the absolute path of the currently active file|
`get_open_in_editor_file_text`|Retrieves the complete text content of the currently active file|
`get_progress_indicators`|Retrieves the status of all running progress indicators|
`get_project_dependencies`|Get list of all dependencies defined in the project|
`get_project_modules`|Get list of all modules in the project with their dependencies|
`get_project_vcs_status`|Retrieves the current version control status of files in the project|
`get_run_configurations`|Returns a list of run configurations for the current project|
`get_selected_in_editor_text`|Retrieves the currently selected text from the active editor|
`get_terminal_text`|Retrieves the current text content from the first active terminal|
`list_available_actions`|Lists all available actions in JetBrains IDE editor|
`list_directory_tree_in_folder`|Provides a hierarchical tree view of the project directory structure|
`list_files_in_folder`|Lists all files and directories in the specified project folder|
`open_file_in_editor`|Opens the specified file in the JetBrains IDE editor|
`replace_current_file_text`|Replaces the entire content of the currently active file|
`replace_file_text_by_path`|Replaces the entire content of a specified file with new text|
`replace_selected_text`|Replaces the currently selected text in the active editor|
`replace_specific_text`|Replaces specific text occurrences in a file with new text|
`run_configuration`|Run a specific run configuration in the current project|
`search_in_files_content`|Searches for a text substring within all files in the project|
`toggle_debugger_breakpoint`|Toggles a debugger breakpoint at the specified line in a project file|
`wait`|Waits for a specified number of milliseconds|

---
## Tools Details

#### Tool: **`create_new_file_with_text`**
Creates a new file at the specified path within the project directory and populates it with the provided text
Parameters|Type|Description
-|-|-
`pathInProject`|`string`|The relative path where the file should be created
`text`|`string`|The content to write into the new file

---
#### Tool: **`execute_action_by_id`**
Executes an action by its ID in JetBrains IDE editor
Parameters|Type|Description
-|-|-
`actionId`|`string`|The ID of the action to execute

---
#### Tool: **`execute_terminal_command`**
Executes a specified shell command in the IDE's integrated terminal
Parameters|Type|Description
-|-|-
`command`|`string`|The shell command to execute

---
#### Tool: **`find_commit_by_message`**
Searches for a commit based on the provided text or keywords in the project history
Parameters|Type|Description
-|-|-
`query`|`string`|The text or keywords to search for in commit messages

---
#### Tool: **`find_files_by_name_substring`**
Searches for all files in the project whose names contain the specified substring
Parameters|Type|Description
-|-|-
`nameSubstring`|`string`|The substring to search for in file names

---
#### Tool: **`get_all_open_file_paths`**
Lists full path relative paths to project root of all currently open files
#### Tool: **`get_all_open_file_texts`**
Returns text of all currently open files in the JetBrains IDE editor
#### Tool: **`get_debugger_breakpoints`**
Retrieves a list of all line breakpoints currently set in the project
#### Tool: **`get_file_text_by_path`**
Retrieves the text content of a file using its path relative to project root
Parameters|Type|Description
-|-|-
`pathInProject`|`string`|The file location from project root

---
#### Tool: **`get_open_in_editor_file_path`**
Retrieves the absolute path of the currently active file
#### Tool: **`get_open_in_editor_file_text`**
Retrieves the complete text content of the currently active file
#### Tool: **`get_progress_indicators`**
Retrieves the status of all running progress indicators
#### Tool: **`get_project_dependencies`**
Get list of all dependencies defined in the project
#### Tool: **`get_project_modules`**
Get list of all modules in the project with their dependencies
#### Tool: **`get_project_vcs_status`**
Retrieves the current version control status of files in the project
#### Tool: **`get_run_configurations`**
Returns a list of run configurations for the current project
#### Tool: **`get_selected_in_editor_text`**
Retrieves the currently selected text from the active editor
#### Tool: **`get_terminal_text`**
Retrieves the current text content from the first active terminal
#### Tool: **`list_available_actions`**
Lists all available actions in JetBrains IDE editor
#### Tool: **`list_directory_tree_in_folder`**
Provides a hierarchical tree view of the project directory structure
Parameters|Type|Description
-|-|-
`pathInProject`|`string`|The starting folder path (use '/' for project root)
`maxDepth`|`integer` *optional*|Maximum recursion depth (default: 5)

---
#### Tool: **`list_files_in_folder`**
Lists all files and directories in the specified project folder
Parameters|Type|Description
-|-|-
`pathInProject`|`string`|The folder path (use '/' for project root)

---
#### Tool: **`open_file_in_editor`**
Opens the specified file in the JetBrains IDE editor
Parameters|Type|Description
-|-|-
`filePath`|`string`|The path of file to open (can be absolute or relative)

---
#### Tool: **`replace_current_file_text`**
Replaces the entire content of the currently active file
Parameters|Type|Description
-|-|-
`text`|`string`|The new content to write

---
#### Tool: **`replace_file_text_by_path`**
Replaces the entire content of a specified file with new text
Parameters|Type|Description
-|-|-
`pathInProject`|`string`|The path to the target file, relative to project root
`text`|`string`|The new content to write

---
#### Tool: **`replace_selected_text`**
Replaces the currently selected text in the active editor
Parameters|Type|Description
-|-|-
`text`|`string`|The replacement content

---
#### Tool: **`replace_specific_text`**
Replaces specific text occurrences in a file with new text
Parameters|Type|Description
-|-|-
`newText`|`string`|The replacement text
`oldText`|`string`|The text to be replaced
`pathInProject`|`string`|The path to the target file, relative to project root

---
#### Tool: **`run_configuration`**
Run a specific run configuration in the current project
Parameters|Type|Description
-|-|-
`name`|`string`|The name of the run configuration to execute

---
#### Tool: **`search_in_files_content`**
Searches for a text substring within all files in the project
Parameters|Type|Description
-|-|-
`searchText`|`string`|The text to find

---
#### Tool: **`toggle_debugger_breakpoint`**
Toggles a debugger breakpoint at the specified line in a project file
Parameters|Type|Description
-|-|-
`filePathInProject`|`string`|The relative path to the file within the project
`line`|`integer`|The line number where to toggle the breakpoint (1-based)

---
#### Tool: **`wait`**
Waits for a specified number of milliseconds
Parameters|Type|Description
-|-|-
`milliseconds`|`integer` *optional*|The duration to wait in milliseconds (default: 5000)

---
## Use this MCP Server

```json
{
  "mcpServers": {
    "jetbrains": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "IDE_PORT",
        "mcp/jetbrains"
      ],
      "env": {
        "IDE_PORT": "8090"
      }
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)
