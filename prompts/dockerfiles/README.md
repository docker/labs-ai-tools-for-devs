---
extractors:
  - image: vonwig/go-linguist:latest
    command:
      - -json
    output-handler: linguist
tool_choice: auto
model: gpt-4
stream: true
functions:
  - name: analyze_project
    description: Analyze a project to determine how it should be built
    type: prompt
    ref: project_type
  - name: write_files
    description: Write a set of files to my project
    parameters:
        type: object
        properties:
          files:
            type: array
            items:
              type: object
              properties:
                path:
                  type: string
                  description: the relative path to the file that should be written
                content:
                  type: string
                  description: the content that should be written to a file
                executable:
                  type: boolean
                  description: whether to make the file executable
    container:
        image: vonwig/function_write_files:latest
  - name: docker_scout_tag_recommendation
    description: get a recommended tag
    parameters:
        type: object
        properties:
          repository:
            type: string 
            description: the name docker image repository
    container:
        image: vonwig/docker_scout_tag_recommendation:latest
---

# Background

These prompts add Dockerfile authoring skills to the assistant.

* the [user prompts](100_user_prompt.md) direct the assist to extract details about the project, and then write a Dockerfile to the root of the project.
* the [npm best practices](npm-best-practices.md) is are added to the system prompts whenever the assist detects that this is an NPM project.

## functions

These instructions in these prompts rely on 3 functions

1. `analyze_project` - requires read-only access to the project and extracts details from the project to give the assistant context for authoring the Dockerfile
2. `write_files` - has read-write access to the project and will write Dockerfiles so that developers don't have to copy and paste data out of a chat.
3. `docker_scout_tag_recommendation` - uses Docker Scout to improve the choice tag selection during code generation.
