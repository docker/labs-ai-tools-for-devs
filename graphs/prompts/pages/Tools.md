# Using a Tool
A [[tool]] augments an LLM assistant by providing it what capabilities in the real world.
By adding tools to prompts during the [authoring process]([[Authoring Prompts]]), our assistant can start to incorporate these new capabilities into a [[conversation loop]].  Here's a prompt that incorporates a tool into the conversation ((66da266d-79cb-489e-afa3-d205619b6f3e))
- # Developing Tools
- ## Containerized Tools
- All tool definition have `name`, `description` and  `parameters` fields.  This is the data that is passed to the LLM so that it can request access to the underlying tool.
  A _container_ tool also has a `container` field which defines how the [prompt engine]([[Running the Prompt Engine]]) should run the tool.  Here is a sample container tool definition.
  ```
  ---
  tools:
    - name: sqlite
      description: run the sqlite command
      parameters:
        type: object
        properties:
          database:
            type: string
            description: the path to the database
          sql:
            type: string
            description: the sql statement to run
      container:
        image: vonwig/sqlite:latest
        command:
          - "{{database}}"
          - "{{sql|safe}}"
  ---
  ```
	- only the `image` field is mandatory but the `command` `entrypoint` and `env` fields are also supported.
	- all of the fields support interpolation using `"{{parameter}}"` syntax.  This allows us to define tools that will be invoked using parameters bound by the LLM.
	- the `"{{sql|safe}}"` syntax above is a django-inspired reference which means that the `sql` string is passed through a `safe` filter.  (TODO:  describe the concept of parameter safety)
- ### Containerized Tools can share data
	- Every _tool_ container will automatically run with a volume mounted into the container at `/thread`.  This means that within the scope of a [conversation loop](conversation-loop), different tools can share data using this mount point.
	  The data is ephemeral so by default, the volume is deleted after each execution of the prompt engine.  If you pass the argument `--thread-id {volume_name}` to the prompt engine then the volume will be preserved for inspection.
- ### Containerized Tools can access parts of the host file system
	- Every _tool_ container will have one host directory mounted into the container at `/project`.  By default, this mount is `rw` but a tool definition can specify `project: ro` or `project: none` in the container definition.  This is encouraged when a tool will not need access to a project's file system.  The [prompt engine]([[Running the Prompt Engine]]) is always started with a `--host-dir` parameter which defines what part of the file system the assistant can access during the run.
- ## Prompt-based Tools
- Besides tools that run in containers, we can also build a tool interface from another prompt.  The definition of prompt-based tool continues to have the `name`, `description` and `parameters` fields but it also must a `type: prompt` and a mandatory `ref` field that points at the prompt file checked in to GitHub.
  ```
  ---
  tools:
    - name: fix-pylint-violation
      description: fix a pylint violation
      parameters:
        type: object
        properties:
          code:
            type: string
            description: the code block
          violation:
            type: string
            description: the description of the violation
      type: "prompt"
      ref: "github:docker/labs-ai-tools-for-devs?path=prompts/pylint/fix-violation.md"
  ---
  ```
  
  When defining a `prompt` type tool, the parameters will be available to be interpolated into the prompt definition before being sent to the model.  For example, the above function definition has parameters `code` and `violation` so the prompt file itself can reference those using moustache template syntax.  For example the prompt file reference above could look like the file below (note the reference `{{code}}` and `{{violation}}` )
  
  ```
  # prompt user
  
  ## Original Code
  {{code}}
  
  ## Pylint Output
  {{violation}}
  
  
  **STRICTLY FOLLOW THE RULES BELOW:**
   generate new code which will resolve the violation
   Return the response in the following format:
  ```python
  <corrected code>
  ```
  
  Instead of a `ref` in the above definition, users can also define a `prompt-file` which must be a relative path (relative the prompt file that was originally passed to the engine). This `prompt-file` field is useful for developing prompts, because we can use local definitions that have not yet been pushed to git.
  ```