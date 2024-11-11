- When defining tools in prompt metadata, users can _interpolate_ tool parameters into the `commands` section of a container definition.  For example, in the following definition of a sqlite tool, the `database` and `sql` parameters from the tool definition will be used to create the container.
  ```
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
  ```
- You can also splice array parameters into the command definition using the `into` filter keyword:
  ```
    - name: docker
      description: run any docker command with arguments
      parameters:
        type: object
        properties:
          args:
            type: array
            items:
              type: string
            description: arguments to pass to the docker CLI
      container:
        image: docker:cli
        command:
          - "{{args|into}}"
  ```
  In this example, the array of strings passed to the `args` parameter of the function will be spliced into the `command` parameter of the container definition.