---
tools:
  - name: fdfind
    description: Runs fd in the current directory.
    parameters:
      type: object
      properties:
        fd_args:
          type: string
          description: The args to pass to fd
        out_file:
          type: string
          description: The path to output 
    container:
      image: vonwig/tree_sitter
      command:
        - "fdfind {{fd_args|safe}} > {{out_file|safe}}"
  - name: run-tree-sitter-flow
    description: Runs a flow with fd and tree sitter in the current directory.
    parameters:
      type: object
      properties:
        in_paths_file:
          type: string
          description: The path of a file containing all paths to parse
        output_dir:
          type: string
          description: The path to output files to
    container:
      image: vonwig/tree_sitter
      command:
        - "while read -r file; do mkdir -p \"{{output_dir|safe}}/$(dirname $file)\" && tree-sitter parse \"$file\" > \"{{output_dir|safe}}/$file.parsed\"; done < {{in_paths_file|safe}}"
  - name: delete_folder
  - name: run-javascript-sandbox
  - name: sqlite
---

# prompt user

1. Delete `/thread/ast`, `/thread/paths.txt`, and ``/thread/ranges.sql`

2. Run fd with args `-e py` to `/thread/paths.txt`

3. Run tree sitter on input `/thread/paths.txt` and output_dir `/thread/ast`.

4. Prepare a JS script to run in the sandbox which 
  Reads `/thread/paths.txt`
  For each path, read the contents of parsed tree file at `/thread/ast/${path}.parsed`.

An example parsed file:

/thread/ast/main.py.parsed
```
(module [0, 0] - [6, 0]
  (comment [0, 0] - [0, 21])
  (import_from_statement [2, 0] - [2, 37]
    module_name: (dotted_name [2, 5] - [2, 22]
      (identifier [2, 5] - [2, 13])
      (identifier [2, 14] - [2, 22]))
    name: (dotted_name [2, 30] - [2, 37]
      (identifier [2, 30] - [2, 37])))
  (if_statement [4, 0] - [5, 17]
    condition: (comparison_operator [4, 3] - [4, 25]
      (identifier [4, 3] - [4, 11])
      (string [4, 15] - [4, 25]
        (string_start [4, 15] - [4, 16])
        (string_content [4, 16] - [4, 24])
        (string_end [4, 24] - [4, 25])))
    consequence: (block [5, 4] - [5, 17]
      (expression_statement [5, 4] - [5, 17]
        (call [5, 4] - [5, 17]
          function: (attribute [5, 4] - [5, 15]
            object: (identifier [5, 4] - [5, 11])
            attribute: (identifier [5, 12] - [5, 15]))
          arguments: (argument_list [5, 15] - [5, 17]))))))
```

  Use a global regex match 
  ```re
    /\n  \((.*) \[(\d*), (\d*)\] - \[(\d*), (\d*)\]/gm
  ``` 
  to get the ranges of each top level node into capturing groups.
  Write the ranges to `/thread/ranges.sql` in the form of sql 
  `INSERT INTO RANGES (ID, START_LINE, END_LINE, START_COLUMN, END_COLUMN, PATH) values (...)`

You need to generate a random string without importing any modules.

Example output of script would be the creation of file `/thread/ranges.sql` with contents:

```sql
INSERT INTO RANGES (ID, START_LINE, START_COLUMN, END_LINE, END_COLUMN, PATH) values ('<random-string>', 0,0,0,21, 'main.py')
INSERT INTO RANGES (ID, START_LINE, START_COLUMN, END_LINE, END_COLUMN, PATH) values ('<random-string>', 2,0,2,37, 'main.py')
INSERT INTO RANGES (ID, START_LINE, START_COLUMN, END_LINE, END_COLUMN, PATH) values ('<random-string>', 4,0,5,17, 'main.py')
```

5. Execute the code in the javascript sandbox.

6. Finally, run `.read /thread/ranges.sql` in `/thread/db.sqlite`
