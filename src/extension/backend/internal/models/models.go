package models

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/docker/dait/internal/utils"
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
	Name      string      `yaml:"name"`
	Model     string      `yaml:"model"`
	Tools     []Tool      `yaml:"tools,omitempty"`
	Resources []Resource  `yaml:"resources,omitempty"`
	Config    []MCPConfig `yaml:"config,omitempty"`
	Arguments []Argument  `yaml:"arguments,omitempty"`
	Prompts   int         `yaml:"prompts"`
	Secrets   []string    `yaml:"secrets,omitempty"`
	Examples  []string    `yaml:"examples,omitempty"`
	Container Container   `yaml:"container,omitempty"`
}

type Container struct {
	Image       string            `yaml:"image"`
	Command     []string          `yaml:"command,omitempty"`
	Volumes     []string          `yaml:"volumes,omitempty"`
	Workdir     string            `yaml:"workdir,omitempty"`
	Environment map[string]string `yaml:"environment,omitempty"`
	Secrets     map[string]string `yaml:"secrets,omitempty"`
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
	Name        string     `yaml:"name"`
	Description string     `yaml:"description"`
	Parameters  Parameters `yaml:"parameters,omitempty"`
	Container   Container  `yaml:"container,omitempty"`
}

type Parameters struct {
	Type       string              `yaml:"type"`
	Properties map[string]Property `yaml:"properties,omitempty"`
}

type Property struct {
	Type        string `yaml:"type"`
	Description string `yaml:"description"`
}

type Resource struct {
	Name        string          `yaml:"name"`
	Description string          `yaml:"description"`
	URI         string          `yaml:"uri"`
	MimeType    string          `yaml:"mimeType"`
	Matches     string          `yaml:"matches"`
	Default     ResourceDefault `yaml:"default,omitempty"`
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

func (tile *Tile) fetchMCPServer(url, dataPath string) error {
	logger.Info("Fetching MCP server for " + tile.Name + " from " + url)
	url = utils.ParseURL(url)
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

func (server *MCPServer) ToJSON() string {
	json, err := json.Marshal(server)
	if err != nil {
		return ""
	}
	return string(json)
}
