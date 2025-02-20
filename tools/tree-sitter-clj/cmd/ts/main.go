package main

import (
	"fmt"
	"io/ioutil"
	"os"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/python"
	"github.com/smacker/go-tree-sitter/yaml"
	"github.com/smacker/go-tree-sitter/sql"
	"github.com/smacker/go-tree-sitter/bash"
	"github.com/smacker/go-tree-sitter/html"
	"github.com/smacker/go-tree-sitter/dockerfile"
)

func main() {
	// Check if both language and query string are provided as arguments
	if len(os.Args) < 3 {
		fmt.Println("Usage: ./program <language> <query_string>")
		return
	}
	language := os.Args[1]
	queryString := os.Args[2]

	// Create a parser
	parser := sitter.NewParser()

	// Set the language based on the first argument
	switch language {
	case "python":
		parser.SetLanguage(python.GetLanguage())
	case "yaml":
		parser.SetLanguage(yaml.GetLanguage())
	case "sql":
		parser.SetLanguage(sql.GetLanguage())
	case "bash":
		parser.SetLanguage(bash.GetLanguage())
	case "html":
		parser.SetLanguage(html.GetLanguage())
	case "dockerfile":
		parser.SetLanguage(dockerfile.GetLanguage())
	default:
		fmt.Printf("Unsupported language: %s\n", language)
		return
	}

	// Read source code from stdin
	sourceCode, err := ioutil.ReadAll(os.Stdin)
	if err != nil {
		fmt.Println("Error reading from stdin:", err)
		return
	}

	// Parse the source code
	tree := parser.Parse(nil, sourceCode)
	defer tree.Close()

	// Create a query
	query, err := sitter.NewQuery([]byte(queryString), python.GetLanguage())
	if err != nil {
		fmt.Println("Error creating query:", err)
		return
	}
	defer query.Close()

	// Execute the query
	qc := sitter.NewQueryCursor()
	defer qc.Close()

	qc.Exec(query, tree.RootNode())

	// Iterate over the query results
	for {
		match, ok := qc.NextMatch()
		if !ok {
			break
		}

		for _, capture := range match.Captures {
			captureName := query.CaptureNameForId(capture.Index)
			nodeText := capture.Node.Content(sourceCode)
			fmt.Printf("Capture: %s, Node: %s\n", captureName, nodeText)
		}
	}
}
