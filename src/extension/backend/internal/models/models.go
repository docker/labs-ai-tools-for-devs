package models

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

type Record struct {
	Event      string
	Properties interface{}
	Sorce      string
	Timestamp  int64
}

type Tile struct {
	Name        string
	Description string
	Icon        string
	CachedIcon  string
	Ref         string
	MCPServer   MCPServer
	Tools       []KV
	Propmts     int
	Resources   map[string]string
	Config      []MCPConfig
	Secrets     []KV
	Examples    map[string]string
}

type KV struct {
	Name        string
	Description string
}

type MCPClient struct {
	Name               string
	URL                string
	ManualConfigSteps  []string
	ExpectedConfigPath map[string]string
}

type MCPClientState struct {
	Client                    MCPClient
	Exists                    bool
	Configured                bool
	Path                      string
	PreventAutoConnectMessage string
}

type MCPServer struct {
	Name      string
	Model     string
	Tools     []Tool
	Resources []Resource
	Config    []MCPConfig
	Arguments []Argument
	Prompts   int
	Secrets   []string
	Examples  []string
	Container Container
}

type Container struct {
	Image       string
	Workdir     string
	Environment map[string]string
	Secrets     map[string]string
	Command     []string `yaml:"command"`
	Volumes     []string `yaml:"volumes"`
}

type MCPConfig struct {
	Name        string
	Description string
	Parameters  map[string]Parameter
}

type Parameter struct {
	Type  string
	Items map[string]string
}

type Tool struct {
	Name        string
	Description string
	Parameters  ParameterSpec
	Container   Container
}

type ParameterSpec struct {
	Type       string
	Properties map[string]Parameter
}

type Resource struct {
	Name        string
	Description string
	URI         string `yaml:"uri"`
	MimeType    string `yaml:"mimeType"`
	Matches     string
	Default     ResourceDefault
}

type ResourceDefault struct {
	Text string
}

type Argument struct {
	Name        string
	Description string
	Required    bool
}

type Registry struct {
	Registry map[string]Tile
}

// url is of the shape:
// github:docker/labs-ai-tools-for-devs?path=prompts/mcp/mcp-notion-server.md
// or with branch:
// github:docker/labs-ai-tools-for-devs?path=prompts/mcp/mcp-notion-server.md&branch=develop
// we need to parse this into
// https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/main/prompts/mcp/mcp-notion-server.md
// or
// https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/refs/heads/develop/prompts/mcp/mcp-notion-server.md
func parseURL(url string) string {
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

func (tile *Tile) fetchMCPServer(url, dataPath string) error {
	logger.Info("Fetching MCP server for " + tile.Name + " from " + url)
	url = parseURL(url)
	logger.Info("Fetching MCP server for " + tile.Name + " from " + url)
	if url == "" {
		return nil
	}
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Parse the MCP server markdown file
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// Save the file temporarily
	tempFile := dataPath + "/" + tile.Name + "-mcp-server.md"
	err = os.WriteFile(tempFile, body, 0644)
	if err != nil {
		return err
	}

	// Parse the file into an MCPServer struct
	server, err := ParseMCPServerFile(tempFile)
	if err != nil {
		return err
	}

	// Update the tile with the server info
	tile.MCPServer = *server

	// Clean up temp file
	_ = os.Remove(tempFile)

	return nil
}

func (tile *Tile) downloadIcons(dataPath string) error {
	logger.Info("Downloading icon for " + tile.Name + " from " + tile.Icon)
	// download icon
	resp, err := http.Get(tile.Icon)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// save icon
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	tile.CachedIcon = dataPath + "/assets/" + strings.Split(tile.Icon, "/")[len(strings.Split(tile.Icon, "/"))-1]
	err = os.WriteFile(tile.CachedIcon, body, 0644)
	if err != nil {
		return err
	}
	return nil
}

func (tile *Tile) ToJSON() string {
	json, err := json.Marshal(tile)
	if err != nil {
		return ""
	}
	return string(json)
}
