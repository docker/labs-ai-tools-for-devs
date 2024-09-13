---
tools:
  - name: run-javascript-sandbox
---

# prompt user

Write a javascript function that reads json from a file named `/thread/violations.json`.
It should then iterate over each element of an array with the following schema:

```json
[
  {"message": "some violation", "path": "app.py", "type": "error",
   "line": 0, "column": 0, "endLine": None, "endColumn": 1, "path": "src/app.py"}
]

```

For each element of the array, it should create two INSERT statements. 

1. The first should insert the columns ID,PATH, START_LINE, END_LINE, START_COLUMN, END_COLUMN 
into a tabled named RANGES using the properties from the map. ID should be a random string. No uuid module here.
2. The second should insert the columns MESSAGE, TYPE, RANGE_ID, VIOLATION_ID into a table named VIOLATIONS using the properties from the map. The RANGE_ID will be the same random string from before. 

If the violation doesn't have an `endLine` or `endColumn` you should simply re-use the start position.

If any strings contain single quotes, they should be escaped.

Line and column represent START_LINE and START_COLUMN

The statements should be written to the file /thread/insert.sql

Now execute the javascript code.

