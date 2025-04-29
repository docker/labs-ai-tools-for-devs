package clients

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/spf13/cobra"
)

const (
	vendorCursor        = "cursor"
	vendorVSCode        = "vscode"
	vendorClaudeDesktop = "claude-desktop"
	vendorContinueDev   = "continue"
	vendorGordon        = "gordon"
)

const (
	orangeYellowColor = "\033[38;5;208m"
	redColor          = "\033[31m"
	greenColor        = "\033[32m"
	resetColor        = "\033[0m"
)

var (
	greenCircle  = fmt.Sprintf("%s\u25CF%s", greenColor, resetColor)
	redCircle    = fmt.Sprintf("%s\u25CF%s", redColor, resetColor)
	orangeCircle = fmt.Sprintf("%s\u25CF%s", orangeYellowColor, resetColor)
)

type listOptions struct {
	Global bool
	JSON   bool
}

func ListCommand(ctx context.Context, cwd string, cfg Config) *cobra.Command {
	opts := &listOptions{}
	cmd := &cobra.Command{
		Use:   "ls",
		Short: "List MCP configurations.",
		RunE: func(*cobra.Command, []string) error {
			return runList(ctx, cwd, cfg, *opts)
		},
		Args: cobra.NoArgs,
	}
	flags := cmd.Flags()
	addGlobalFlag(flags, &opts.Global)
	flags.BoolVar(&opts.JSON, "json", false, "Print as JSON.")
	return cmd
}

func runList(ctx context.Context, cwd string, config Config, opts listOptions) error {
	projectRoot := findGitProjectRoot(cwd)
	if projectRoot == "" && !opts.Global {
		return errNotInGitRepo
	}
	var result Configs
	if opts.Global {
		result = parseGlobalConfigs(ctx, config)
	} else {
		result = parseLocalProjectConfigs(projectRoot, config)
	}
	if opts.JSON {
		jsonData, err := json.MarshalIndent(result.GetData(), "", "  ")
		if err != nil {
			return err
		}
		fmt.Println(string(jsonData))
		return nil
	}
	result.HumanPrint()
	return nil
}

type Configs interface {
	HumanPrint()
	GetData() any
}

func prettifyCommand(name, cmd string) string {
	if name == "MCP_DOCKER" {
		return "Docker MCP Catalog (gateway server)"
	}
	return cmd
}

type ProjectConfigs struct {
	root string
	data map[string]ProjectMCPClientCfg
}

func (cfg ProjectConfigs) HumanPrint() {
	fmt.Printf("=== Project-wide MCP Configurations (%s) ===\n", cfg.root)
	for vendor, data := range cfg.data {
		if !data.IsConfigured {
			fmt.Printf(" %s %s: no mcp configured\n", redCircle, vendor)
			continue
		}
		prettyPrintBaseData(vendor, data.MCPClientCfgBase)
	}
}

func (cfg ProjectConfigs) GetData() any {
	return cfg.data
}

func parseLocalProjectConfigs(projectRoot string, config Config) ProjectConfigs {
	result := ProjectConfigs{root: projectRoot, data: make(map[string]ProjectMCPClientCfg)}
	for v, pathCfg := range config.Project {
		processor, err := NewLocalCfgProcessor(pathCfg, projectRoot)
		if err != nil {
			continue
		}
		cfg := processor.Parse()
		cfg.MCPClientCfgBase.ConfigName = v
		result.data[v] = cfg
	}
	return result
}

type GlobalConfig map[string]MCPClientCfg

func (cfg GlobalConfig) HumanPrint() {
	fmt.Printf("=== System-wide MCP Configurations ===\n")
	for vendor, data := range cfg {
		if !data.IsInstalled || !data.IsOsSupported {
			continue
		}
		prettyPrintBaseData(vendor, data.MCPClientCfgBase)
	}
}

func prettyPrintBaseData(vendor string, data MCPClientCfgBase) {
	if data.Err != nil {
		fmt.Printf(" %s %s: %s\n", redCircle, vendor, data.Err.Err)
		return
	}
	circle := redCircle
	nrServers := 0
	if data.cfg != nil {
		nrServers = len(data.cfg.STDIOServers) + len(data.cfg.SSEServers)
	}
	if nrServers > 0 {
		circle = orangeCircle
	}
	connected := "disconnected"
	if data.IsMCPCatalogConnected {
		circle = greenCircle
		connected = "connected"
	}
	fmt.Printf(" %s %s: %s\n", circle, vendor, connected)
	if data.cfg == nil {
		return
	}
	for _, server := range data.cfg.STDIOServers {
		fmt.Printf("   %s: %s (stdio)\n", server.Name, prettifyCommand(server.Name, server.String()))
	}
	for _, server := range data.cfg.SSEServers {
		fmt.Printf("   %s: %s (sse)\n", server.Name, server.String())
	}
}

func (cfg GlobalConfig) GetData() any {
	return cfg
}

func parseGlobalConfigs(ctx context.Context, config Config) GlobalConfig {
	result := make(map[string]MCPClientCfg)
	for v, pathCfg := range config.System {
		processor, err := NewGlobalCfgProcessor(pathCfg)
		if err != nil {
			continue
		}
		cfg := processor.ParseConfig()
		cfg.MCPClientCfgBase.ConfigName = v
		result[v] = cfg
	}
	result[vendorGordon] = getGordonSetup(ctx)
	return result
}
