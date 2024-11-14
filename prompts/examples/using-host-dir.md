---
tools:
  - name: ls
    description: list files in a directory
    container:
      image: alpine:latest
      command:
        - ls
        - /project
  - name: echo
    description: echo the current host dir
    container:
      image: vonwig/bash_alpine
      command:
        - -c
        - "echo {{hostDir}}"
---

# Background 

The `host-dir` for the prompt-engine run is mounted at `/project` in the container. 
So in the tool above, you'll see that the tool can only access your host-dir from this `/project` path.
However, the tools can be passed the _value_ of the hostDir even if they can only access it via the `/project` mount.
See the `echo` tool for an example of how this value becomes accessible (the `{{hostDir}}` 
can also be used directly in prompt templates.

# Prompt user

Start by listing the files in my host-dir and then run echo. Summarize by writing the output of the echo command and then
write a poem using the file names from that directory.

