# Usage

When an agent needs to extract code ranges using tree-sitter queries (tree-sitter queries are already very common and current foundational LLM can already generate these queries).
Internally, this tool uses nixpkgs to pull pre-compiled, and verified parsers. `markdown`, `python`, `java`, `html`, `dockerfile`, and `bash` are all tested but obviously hundreds of different
languages are supported.

For example, if we prompt an LLM to "extract top-level function definitions from a Python module", it will generate the following query.

```lisp
(module (function_definition) @top-level)
```

The agent interface is shown here. This is the interface that the agent will use to interace with the tool.
As always, the tool itself is a docker container.

```yaml
name: tree-sitter
description: Extract code ranges using tree-sitter queries
parameters:
  type: object
  properties:
    lang:
      type: string
      description: language to parse
    query:
      type: string
      description: tree-sitter query
    file:
      type: string
      description: the file to parse
  container:
    image: vonwig/tree-sitter:latest
    command:
      - "-lang"
      - "{{lang}}"
      - "-query"
      - "{{query}}"
    stdin:
      file: "{{file}}"
```

The tool streams back a series of json code ranges.

```json
{
  "capture_name": "top-level",
  "node_text": "def hello():\\n\\tprint(\"hello\")",
  "start_byte": 0,
  "end_byte": 30,
  "start_point": {
    "row": 0,
    "column": 0
  },
  "end_point": {
    "row": 0,
    "column": 30
  }
}
```

## Aside on tool creation

This tool itself was co-authored alongside gpt-4.

## Using the container

The tool can also be called directly using `docker run`.

```sh
docker run --rm -i vonwig/tree-sitter \
                   -lang python \
                   -query "(module (function_definition) @top-level)" \
                   < <(echo "def hello():\n\tprint(\"hello\")")
```

