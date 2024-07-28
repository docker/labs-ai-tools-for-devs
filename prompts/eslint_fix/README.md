---
functions:
  - name: eslint
    type: prompt
    ref: github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/eslint
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
                description: the relative path to the file that the script should run in
        script:
          type: string
          description: The script to run in the files.
    container:
      image: vonwig/apply_script:latest
  - name: read_eslint
    description: Loads ESLint violations
    parameters:
      type: object
      properties:
        output_level:
          type: string
          description: "`condensed` or `complaints`"
    container:
      image: vonwig/read_eslint
---