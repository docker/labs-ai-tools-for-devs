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
  {"name": "hello", "age": 1}
]
```

For each element of the array, it should create an INSERT statement for a table named PEOPLE with the properties from the map.

The statement should be printed to the console.

Now execute the javascript code.

