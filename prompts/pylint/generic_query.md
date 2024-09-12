---
tools:
  - name: sqlite
    description: execute SQLite commands
    parameters:
      type: object
      properties:
        database:
          type: string
          description: The path to the SQLite database
        sql:
          type: string
          description: The SQL command to run
    container:
      image: vonwig/sqlite:latest
      command:
        - "{{database}}"
        - "{{sql|safe}}"
---

# prompt user

How many rows are in the ranges and violations tables? Use database `/thread/db.sqlite`