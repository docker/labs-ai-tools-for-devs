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

The database is `/thread/db.sqlite`

Tables:
CODE
RANGES
VIOLATIONS

Both violations and code tables share a foreign key reference to RANGES.

Query the shcema of all of these tables.

Answer the following questions:

What is the last violation with a non-null END_LINE in ranges?

What is the code for that violation?
