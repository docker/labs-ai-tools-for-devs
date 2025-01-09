---
model: claude-3-5-sonnet-20241022
tools:
  - name: read_file
    description: |
      read a file from disk
      Read the complete contents of a file from the file system.
      Handles various text encodings and provides detailed error messages
      if the file cannot be read. Use this tool when you need to examine
      the contents of a single file. Only works within allowed directories.
    parameters:
      type: object
      properties:
        path:
          type: string
    container:
      image: vonwig/bash_alpine
      entrypoint: cat
      command:
        - "{{path|safe}}"
  - name: write_file
    description: |
      Create a new file or completely overwrite an existing file with new content.
      Use with caution as it will overwrite existing files without warning.
      Handles text content with proper encoding. Only works within allowed directories.
    parameters:
      type: object
      properties:
        path:
          type: string
        content:
          type: string
    container:
      image: vonwig/bash_alpine
      command:
        - "-c"
        - "echo {{content|safe}} > {{path|safe}}"
---

# prompt user

read the file deps.edn and then write the string "blah.txt" into the file test.txt
