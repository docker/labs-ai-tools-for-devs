package main

import (
	"fmt"
	"io/ioutil"
	"os"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/python"
	"github.com/smacker/go-tree-sitter/yaml"
	"github.com/smacker/go-tree-sitter/bash"
	"github.com/smacker/go-tree-sitter/html"
	"github.com/smacker/go-tree-sitter/dockerfile"
	markdown "github.com/smacker/go-tree-sitter/markdown/tree-sitter-markdown"
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
	var lang *sitter.Language
	switch language {
	case "python":
		lang = python.GetLanguage()
	case "yaml":
		lang = yaml.GetLanguage()
	case "bash":
		lang = bash.GetLanguage()
	case "html":
		lang = html.GetLanguage()
	case "dockerfile":
		lang = dockerfile.GetLanguage()
	case "markdown":
		lang = markdown.GetLanguage()
	default:
		fmt.Printf("Unsupported language: %s\n", language)
		return
	}
	parser.SetLanguage(lang)

	// Read source code from stdin
	sourceCode, err := ioutil.ReadAll(os.Stdin)
	if err != nil {
		fmt.Println("Error reading from stdin:", err)
		return
	}

	// Parse the source code
	tree := parser.Parse(nil, sourceCode)
	defer tree.Close()

	// Write the S-expression of the tree to stdout
	fmt.Println(tree.RootNode().String())

	// Create a query
	query, err := sitter.NewQuery([]byte(queryString), lang)
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
