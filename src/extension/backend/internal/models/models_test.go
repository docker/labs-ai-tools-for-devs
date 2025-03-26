package models

import (
	"testing"
)

func TestParseURL(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "GitHub URL with default branch",
			input:    "github:docker/labs-ai-tools-for-devs?path=prompts/mcp/mcp-notion-server.md",
			expected: "https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/mcp/mcp-notion-server.md",
		},
		{
			name:     "GitHub URL with custom branch",
			input:    "github:docker/labs-ai-tools-for-devs?path=prompts/mcp/mcp-notion-server.md&branch=develop",
			expected: "https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/develop/prompts/mcp/mcp-notion-server.md",
		},
		{
			name:     "GitHub URL with branch parameter first",
			input:    "github:docker/labs-ai-tools-for-devs?branch=feature/new-feature&path=prompts/mcp/mcp-notion-server.md",
			expected: "https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/feature/new-feature/prompts/mcp/mcp-notion-server.md",
		},
		{
			name:     "Non-GitHub URL",
			input:    "https://example.com/file.md",
			expected: "https://example.com/file.md",
		},
		{
			name:     "Invalid GitHub URL - no query params",
			input:    "github:docker/labs-ai-tools-for-devs",
			expected: "",
		},
		{
			name:     "Invalid GitHub URL - no path param",
			input:    "github:docker/labs-ai-tools-for-devs?invalid=param",
			expected: "",
		},
		{
			name:     "GitHub URL with branch but no path",
			input:    "github:docker/labs-ai-tools-for-devs?branch=develop",
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := parseURL(tt.input)
			if result != tt.expected {
				t.Errorf("parseURL(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}
