package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"encoding/json"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/python"
	"github.com/smacker/go-tree-sitter/yaml"
	"github.com/smacker/go-tree-sitter/bash"
	"github.com/smacker/go-tree-sitter/html"
	"github.com/smacker/go-tree-sitter/dockerfile"
	"github.com/smacker/go-tree-sitter/golang"
	"github.com/smacker/go-tree-sitter/java"
	"github.com/smacker/go-tree-sitter/javascript"
	markdown "github.com/smacker/go-tree-sitter/markdown/tree-sitter-markdown"
	typescript "github.com/smacker/go-tree-sitter/typescript/typescript"
	tsx "github.com/smacker/go-tree-sitter/typescript/tsx"
)

func main() {
	// Define flags
	languagePtr := flag.String("lang", "", "The programming language to parse (required)")
	queryPtr := flag.String("query", "", "The query string to execute (required)")

	// Parse flags
	flag.Parse()

	// Check if required flags are provided
	if *languagePtr == "" {
		fmt.Println("Usage: ./program -lang <language> -query <query_string>")
		flag.PrintDefaults()
		return
	}

	// language is mandatory
	language := *languagePtr

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
	case "golang":
		lang = golang.GetLanguage()
	case "java":
		lang = java.GetLanguage()
	case "javascript":
		lang = javascript.GetLanguage()
	case "typescript":
		lang = typescript.GetLanguage()
	case "tsx":
		lang = tsx.GetLanguage()
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

	queryString := *queryPtr
	if queryString == "" {
		// Write the S-expression of the tree to stdout
		fmt.Println(tree.RootNode().String())
		return
	}

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
			
			captureInfo := struct {
				CaptureName string `json:"capture_name"`
				NodeText    string `json:"node_text"`
				StartByte   uint32 `json:"start_byte"`
				EndByte     uint32 `json:"end_byte"`
				StartPoint  struct {
					Row    uint32 `json:"row"`
					Column uint32 `json:"column"`
				} `json:"start_point"`
				EndPoint struct {
					Row    uint32 `json:"row"`
					Column uint32 `json:"column"`
				} `json:"end_point"`
			}{
				CaptureName: captureName,
				NodeText:    nodeText,
				StartByte:   capture.Node.StartByte(),
				EndByte:     capture.Node.EndByte(),
				StartPoint: struct {
					Row    uint32 `json:"row"`
					Column uint32 `json:"column"`
				}{
					Row:    capture.Node.StartPoint().Row,
					Column: capture.Node.StartPoint().Column,
				},
				EndPoint: struct {
					Row    uint32 `json:"row"`
					Column uint32 `json:"column"`
				}{
					Row:    capture.Node.EndPoint().Row,
					Column: capture.Node.EndPoint().Column,
				},
			}

			jsonData, err := json.MarshalIndent(captureInfo, "", "  ")
			if err != nil {
				fmt.Println("Error marshaling JSON:", err)
				continue
			}

			fmt.Println(string(jsonData))
		}
	}
}
