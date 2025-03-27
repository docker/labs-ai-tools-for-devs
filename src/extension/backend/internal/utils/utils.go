package utils

import (
	"strings"

	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

// url is of the shape:
// github:docker/labs-ai-tools-for-devs?path=prompts/mcp/mcp-notion-server.md
// or with branch:
// github:docker/labs-ai-tools-for-devs?path=prompts/mcp/mcp-notion-server.md&branch=develop
// we need to parse this into
// https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/mcp/mcp-notion-server.md
// or
// https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/develop/prompts/mcp/mcp-notion-server.md
func ParseURL(url string) string {
	// Check if the URL starts with "github:"
	if !strings.HasPrefix(url, "github:") {
		// Return the URL as is if it's not a GitHub URL
		return url
	}

	// Remove the "github:" prefix
	githubPath := strings.TrimPrefix(url, "github:")

	// Split by "?" to separate the repo path and query parameters
	parts := strings.Split(githubPath, "?")
	if len(parts) != 2 {
		logger.Error("Invalid GitHub URL format: " + url)
		return ""
	}

	// Extract the repo path (e.g., "docker/labs-ai-tools-for-devs")
	repoPath := parts[0]

	// Parse query parameters
	queryParams := parts[1]
	queryParts := strings.Split(queryParams, "&")

	// Initialize variables for path and branch
	var filePath string
	branch := "main" // Default branch

	// Extract path and branch from query parameters
	for _, param := range queryParts {
		if strings.HasPrefix(param, "path=") {
			filePath = strings.TrimPrefix(param, "path=")
		} else if strings.HasPrefix(param, "branch=") {
			branch = strings.TrimPrefix(param, "branch=")
		}
	}

	// Validate that we have a file path
	if filePath == "" {
		logger.Error("Missing path parameter in GitHub URL: " + url)
		return ""
	}

	// Construct the raw GitHub URL
	rawURL := "https://raw.githubusercontent.com/" + repoPath + "/refs/heads/" + branch + "/" + filePath

	return rawURL
}
