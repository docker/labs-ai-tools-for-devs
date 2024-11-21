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
host-dir: /Users/slim/repo/bobloblaw
---

# Background

This shows how an agent can work with a _private_ git repository.

This tests that we can clone and make a change to a private repo. The git container mounts a prepared .ssh directory and .gitconfig file. In order to try this one, you'll need to do 3 things.

1. Create an empty directory on your host machine and update the `host-dir` parameter to point at it.  Make it empty.  The agent is going to clone into this.
1. Update the two mounts in git tool entry. They need a valid .ssh and .gitconfig that are okay sharing with the git container (read-only).
2. Update the prompt below to point at a private repo with a README.md that we can update.

# prompt user

1.  use the git tool to clone git@github.com:slimslenderslacks/bobloblaw.git into the current directory. Do not create a new directory.  It's okay if this 
    fails because the repository is already cloned.
2.  use the append tool to write me a special message in the README.md file.
3.  use the git tool to commit the changes to the README.md file with the message "thankyou for being you".
4.  use the git tool to push the changes.

