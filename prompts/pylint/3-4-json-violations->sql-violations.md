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
The first should insert the columns ID, PATH, START_LINE, END_LINE, START_COLUMN, END_COLUMN 
into a tabled named RANGES using the properties from the map.  The ID column should be a random string.
The second should insert the columns MESSAGE, TYPE, RANGE into a table named VIOLATIONS 
using the properties from the map.  The RANGE column should be the ID of the previous row in the RANGES table.
If any strings contain single quotes, they should be escaped.

The statements should be written to the file /thread/insert.sql

Now execute the javascript code.

