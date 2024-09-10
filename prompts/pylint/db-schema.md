---
tools:
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
        - "{{sql}}"
---

# prompt user

Write a SQL schema for a table named RANGES with columns ID, PATH, START_LINE, END_LINE, START_COLUMN, and 
END_COLUMN. The ID is the primary key and should be sequenced.

Write a SQL schema for a table named VIOLATIONS with a foreign key named RANGE, and columns
MESSAGE, TYPE, and ID.  The ID is the primary key.

Run the sqlite command with the database set to `/thread/db.dqlite` and send the SQL generated above.

