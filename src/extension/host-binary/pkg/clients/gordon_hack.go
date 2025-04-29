package clients

import (
	"context"
	"encoding/json"
	"os/exec"
)

func getGordonSetup(ctx context.Context) MCPClientCfg {
	result := MCPClientCfg{
		MCPClientCfgBase: MCPClientCfgBase{
			DisplayName: "Gordon",
			ConfigName:  vendorGordon,
			Err:         nil,
		},
		IsInstalled:   true,
		IsOsSupported: true,
	}
	out, err := exec.CommandContext(ctx, "docker", "ai", "config", "get").Output()
	if err != nil {
		result.Err = classifyError(err)
		return result
	}
	temp := struct {
		Features []struct {
			Name    string `json:"name"`
			Enabled bool   `json:"enabled"`
		} `json:"features"`
	}{}
	if err := json.Unmarshal(out, &temp); err != nil {
		result.Err = classifyError(err)
		return result
	}
	for _, feature := range temp.Features {
		if feature.Name == "MCP Catalog" && feature.Enabled {
			result.IsMCPCatalogConnected = true
			result.cfg = &MCPJSONLists{STDIOServers: []MCPServerSTDIO{{Name: DockerMCPCatalog}}}
			break
		}
	}
	return result
}

func connectGordon(ctx context.Context) error {
	return exec.CommandContext(ctx, "docker", "ai", "config", "set-feature", "MCP Catalog", "true").Run()
}

func disconnectGordon(ctx context.Context) error {
	return exec.CommandContext(ctx, "docker", "ai", "config", "set-feature", "MCP Catalog", "false").Run()
}
