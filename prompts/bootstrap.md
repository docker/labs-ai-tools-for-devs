```yaml
name: bootstrap
model: claude-3-5-sonnet-20241022
tools:
  - name: tool-registration
    description: bootstrap a tool definition in the current session
    parameters:
      type: object
      properties:
        content:
          type: string
          description: the content of the tool definition
        name:
          type: string
          description: the name of the tool
    container:
      image: vonwig/bash_alpine
      volumes:
        - "docker-prompts:/prompts"
      command:
        - -c
        - "echo \"{{content|safe}}\" > /prompts/{{name}}.md"
  - name: write_files
  - name: read-file
```

# Sample Test prompt to create a new tool definition

Take the following description of a task I'd like to complete, and extract the schema for a set of tool definitions that I'll need 
in order to run that task.  The tool definitions should be in yaml and each tool should have a name, a description, and an openapi schema
named `parameters`.  Add the tools as a vector with a top-level field named `tools`. Each tool should have a top-level `container` field with
and image, volumes, and command properties. The command properties must be a vector of arguments.  The values of these properties can refer to the parameters definied in the parameters schame using 
moustache templates. The final yaml definition should be written into a code block of a markdown file named tools.md.
        
> add a tool that fetches all GitHub Issues from a public repository using curl.  We do not need a token.

# Sample Test prompt to register a tool from a local file

Read in the file tools.md and then bootstrap the tool definition with the name 'github-issues'

