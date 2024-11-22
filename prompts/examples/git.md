<!--
---
tools:
  - name: append
    parameters:
      type: object
      properties:
        file:
          type: string
          description: the file to append to
        message:
          type: string
          description: special message
    container:
      image: vonwig/bash_alpine
      command:
        - "-c"
        - "echo \"{{message}}\" >> {{file}}"
  - name: git
    parameters:
      type: object
      properties:
        args:
          type: array
          description: the args to send to git
          items:
            type: string
    container:
     image: alpine/git:latest
     mounts:
       - "/Users/slim/agent/.ssh:/root/.ssh:ro"
       - "/Users/slim/agent/.gitconfig:/root/.gitconfig:ro"
     command:
       - --no-pager
       - "{{args|into}}"
  - name: gh
    container:
      env:
        GITHUB_TOKEN: "{{pat}}"
workdir: /thread/docker-test
---
-->

# Background

This shows how an agent can work with a _private_ git repository.

This tests that we can clone and make a change to a private repo. The git container mounts a prepared .ssh directory and .gitconfig file. In order to try this one, you'll need to do 2 things.

1. Update the two mounts in git tool entry from the comment above. This is how you will provide credential access to the git container (read-only).
2. Update the prompt in the section below to point at a private repo of your choosing.

The next section contains the prompt that will be sent to the agent.  This is where the agent instructions begin.

# prompt user

Create a random branch named that starts with the string 'slim/', contains 5 random numbers or letters, and no spaces. I will refer to this as the branch name.

*  use the git tool to clone git@github.com:slimslenderslacks/bobloblaw.git into the current directory. Do not create a new directory.  It's okay if this 
   fails because the repository is already cloned.
*  use the git tool to create a branch with the branch name described above. 
*  use the append tool to write me a special message in the README.md file.
*  use the git tool to commit the changes to the README.md file with the message "thankyou for being you".
*  use the git tool to push the changes.
*  use the github cli to create a pull request for this branch name with the title "here's my secret message".

