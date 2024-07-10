---
extractors:
model: gpt-4
stream: true
functions:
  - container:
      image: vonwig/github-cli:latest
      entrypoint:
        - entrypoint
      command:
        - repo-create
      env:
        GITHUB_TOKEN: ""
    name: gh-repo-create
    description: "GitHub CLI"
    parameters:
        type: object
        properties:
          org:
            type: string
            description: the name of the github organization
          name:
            type: string
            description: the name of the new GitHub repository
          public:
            type: boolean
            description: whether the new repository should be public or not
---

# Background

Bring GitHub CLI into AI flows
