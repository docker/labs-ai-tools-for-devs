---
functions:
  - name: pylint
    description: Runs pylint against current project
    parameters:
        type: object
        properties:
          output_format:
            type: string 
            description: The output level to use. `summary` | `json` | `condensed` | `complaints`
    container:
        image: vonwig/pylint:latest
---
