package models

import (
	"bytes"
	"io"
	"net/http"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
)

func RefreshCatalog(url, dataPath string) error {
	logger.Info("Loading catalog from " + url)
	resp, err := http.Get(url)
	if err != nil {
		logger.Error(err)
		return err
	}
	defer resp.Body.Close()

	// save catalog.yaml
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.Error(err)
		return err
	}
	err = os.WriteFile(dataPath+"/catalog.yaml", body, 0644)
	if err != nil {
		logger.Error(err)
		return err
	}
	return nil
}

func ParseCatalog(dataPath string) ([]Tile, error) {
	registry := Registry{}
	tiles := []Tile{}

	// read catalog.yaml
	resp, err := os.Open(dataPath + "/catalog.yaml")
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	// decode yaml
	err = yaml.NewDecoder(resp).Decode(&registry)
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	for name, tile := range registry.Registry {
		tile.Name = name
		err = tile.downloadIcons(dataPath)
		if err != nil {
			// ignore errors
			logger.Error(err, tile.Name)
			continue
		}
		if tile.Ref != "" {
			logger.Info("Downloading prompts for " + tile.Name + " from " + tile.Ref)
			err = tile.fetchMCPServer(tile.Ref, dataPath)
			if err != nil {
				logger.Error(err, tile.Name)
				continue
			}
		}
		tiles = append(tiles, tile)
	}
	for _, tile := range tiles {
		logger.Info("Loaded \n" + tile.ToJSON())
	}

	return tiles, nil
}

// ParseMCPServerFile parses an MCP server markdown file and returns an MCPServer struct
func ParseMCPServerFile(filePath string) (*MCPServer, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	// Extract YAML front matter
	frontMatter, err := extractFrontMatter(content)
	if err != nil {
		return nil, err
	}

	// Parse YAML into MCPServer struct
	var server MCPServer
	err = yaml.Unmarshal(frontMatter, &server)
	if err != nil {
		return nil, err
	}

	return &server, nil
}

// extractFrontMatter extracts the YAML front matter from markdown content
func extractFrontMatter(content []byte) ([]byte, error) {
	const delimiter = "---\n"
	reader := bytes.NewReader(content)

	// Read first line, must be delimiter
	firstLine, err := readLine(reader)
	if err != nil || firstLine != delimiter {
		return nil, err
	}

	// Read until next delimiter
	var frontMatter bytes.Buffer
	for {
		line, err := readLine(reader)
		if err != nil {
			return nil, err
		}
		if line == delimiter {
			break
		}
		frontMatter.WriteString(line)
	}

	return frontMatter.Bytes(), nil
}

// readLine reads a line from a reader
func readLine(r io.Reader) (string, error) {
	var line strings.Builder
	buf := make([]byte, 1)
	for {
		n, err := r.Read(buf)
		if err != nil {
			if err == io.EOF {
				return line.String(), nil
			}
			return "", err
		}
		if n == 0 {
			continue
		}
		if buf[0] == '\n' {
			return line.String() + string(buf[0]), nil
		}
		line.WriteByte(buf[0])
	}
}
