package models

import (
	"os"
	"path/filepath"
	"testing"
)

func TestParseMCPServerFile(t *testing.T) {
	// Set test environment variable
	os.Setenv("GO_TEST", "1")

	// Create a temporary directory for testing
	tmpDir, err := os.MkdirTemp("../data", "mcp-test")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	// Create assets directory
	err = os.MkdirAll(filepath.Join(tmpDir, "assets"), 0755)
	if err != nil {
		t.Fatalf("Failed to create assets dir: %v", err)
	}

	// Run the test
	server, err := ParseMCPServerFile("../data/mcp-server.md")
	if err != nil {
		t.Fatalf("Failed to parse MCP server file: %v", err)
	}

	// Test basic fields
	if server.Name != "sqlite" {
		t.Errorf("Expected name to be 'sqlite', got '%s'", server.Name)
	}
	if server.Model != "claude-3-5-sonnet-20241022" {
		t.Errorf("Expected model to be 'claude-3-5-sonnet-20241022', got '%s'", server.Model)
	}

	// Test tools
	if len(server.Tools) != 6 {
		t.Errorf("Expected 6 tools, got %d", len(server.Tools))
	}

	// Test first tool
	firstTool := server.Tools[0]
	if firstTool.Name != "read-query" {
		t.Errorf("Expected first tool name to be 'read-query', got '%s'", firstTool.Name)
	}
	if firstTool.Description != "Execute a SELECT query on the SQLite database" {
		t.Errorf("Expected first tool description to be 'Execute a SELECT query on the SQLite database', got '%s'", firstTool.Description)
	}

	// Test resources
	if len(server.Resources) != 1 {
		t.Errorf("Expected 1 resource, got %d", len(server.Resources))
	}

	// Test first resource
	firstResource := server.Resources[0]
	if firstResource.Name != "Business Insights Memo" {
		t.Errorf("Expected first resource name to be 'Business Insights Memo', got '%s'", firstResource.Name)
	}
	if firstResource.URI != "memo://insights" {
		t.Errorf("Expected first resource URI to be 'memo://insights', got '%s'", firstResource.URI)
	}

	// Test arguments
	if len(server.Arguments) != 1 {
		t.Errorf("Expected 1 argument, got %d", len(server.Arguments))
	}

	// Test first argument
	firstArg := server.Arguments[0]
	if firstArg.Name != "topic" {
		t.Errorf("Expected first argument name to be 'topic', got '%s'", firstArg.Name)
	}
	if !firstArg.Required {
		t.Error("Expected first argument to be required")
	}
}
