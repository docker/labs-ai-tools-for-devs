---
tools:
  - name: run-javascript-sandbox
    description: execute javascript code
    parameters:
      type: object
      properties:
        javascript:
          type: string
          description: the javascript code to run
    container:
      image: vonwig/javascript-runner
      command:
        - "{{javascript|safe}}"
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
---

# prompt user

Write a javascript function that reads json from a file named `/thread/violations.json`.
It should then iterate over each element of an array with the following schema:

```json
[
  {"message": "some violation", "path": "app.py", "type": "error",
   "line": 0, "column": 0, "endLine": 1, "endColumn": 1, "path": "src/app.py"}
]
```

For each element of the array, it should create two INSERT statements. 
The first should insert the columns MESSAGE, and TYPE into a table named VIOLATIONS using the properties from the map.
The second should insert the the columns PATH, START_LINE, END_LINE, START_COLUMN, END_COLUMN into a tabled named RANGE using the properties from the map.

The statements should be written to the file /thread/insert.sql

Now execute the javascript code.

