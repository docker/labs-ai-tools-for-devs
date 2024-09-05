# Prompt files
The simplest prompt file is just markdown content.  We use `h1` headers to delineate the blocks containing prompts and the name of the header to determine the prompt role.
A prompt file can also contain metadata about how to generate and run the prompt.
{{embed ((66d7f3ff-8769-40b3-b6b5-fc4fceea879e)) }}
The example above defines a lot of metadata.  A prompt file might also be very simple.
{{embed ((66d8a396-9268-4917-882f-da4c52b7b5dd)) }}
Use the [prompt engine]([[Running the Prompt Engine]]) to run this prompt file against an LLM.
-