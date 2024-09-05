# Using a Tool
A [[tool]] augments an LLM assistant by providing it what capabilities in the real world.
By adding tools to prompts during the [authoring process]([[Authoring Prompts]]), our assistant can start to incorporate these new capabilities into a [[conversation loop]].  Here's a prompt that incorporates a tool into the conversation ((66da266d-79cb-489e-afa3-d205619b6f3e)).
- # Developing Tools
- ## Containerized Tools can share data
	- Every _tool_ container will automatically run with a volume mounted into the container at `/thread`.  This means that within the scope of a [conversation loop](conversation-loop), different tools can share data using this mount point.
	  The data is ephemeral so by default, the volume is deleted after each execution of the prompt engine.  If you pass the argument `--thread-id {volume_name}` to the prompt engine then the volume will be preserved for inspection.