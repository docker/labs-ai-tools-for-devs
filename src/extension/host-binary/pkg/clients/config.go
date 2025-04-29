package clients

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"golang.org/x/exp/maps"
	"gopkg.in/yaml.v3"
)

//go:embed config.yml
var configYaml string

var (
	getProjectRoot  = findGitProjectRoot
	errNotInGitRepo = errors.New("not in a git repo")
)

func NewClientCmd(ctx context.Context, cwd string) *cobra.Command {
	cfg := readConfig()
	cmd := &cobra.Command{
		Use:   "client",
		Short: "Connect/disconnect MCP clients.",
	}
	cmd.AddCommand(ListCommand(ctx, cwd, *cfg))
	cmd.AddCommand(ConnectCommand(ctx, cwd, *cfg))
	cmd.AddCommand(DisconnectCommand(ctx, cwd, *cfg))
	return cmd
}

type Config struct {
	System  map[string]globalCfg `yaml:"system"`
	Project map[string]localCfg  `yaml:"project"`
}

func readConfig() *Config {
	var result Config
	_ = yaml.Unmarshal([]byte(configYaml), &result)
	return &result
}

func addGlobalFlag(flags *pflag.FlagSet, p *bool) {
	flags.BoolVarP(p, "global", "g", false, "Change the system wide configuration or the clients setup in your current git repo.")
}

func addQuietFlag(flags *pflag.FlagSet, p *bool) {
	flags.BoolVarP(p, "quiet", "q", false, "Only display errors.")
}

func findGitProjectRoot(dir string) string {
	for {
		gitPath := filepath.Join(dir, ".git")
		if _, err := os.Stat(gitPath); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return ""
}

func getSupportedMCPClients(cfg Config) []string {
	tmp := map[string]struct{}{
		vendorGordon: {},
	}
	for k := range cfg.System {
		tmp[k] = struct{}{}
	}
	for k := range cfg.Project {
		tmp[k] = struct{}{}
	}
	result := maps.Keys(tmp)
	sort.Strings(result)
	return result
}

type ErrVendorNotFound struct {
	global bool
	vendor string
	config Config
}

func (e *ErrVendorNotFound) Error() string {
	var alternative string
	if e.global {
		if _, ok := e.config.Project[e.vendor]; ok {
			alternative = " Did you mean to not use the --global flag?"
		}
	} else {
		if _, ok := e.config.System[e.vendor]; ok {
			alternative = " Did you mean to use the --global flag?"
		}
	}
	return "Vendor not found: " + e.vendor + "." + alternative
}

type Updater func(key string, server *MCPServerSTDIO) error

func newMCPGatewayServer(client string) *MCPServerSTDIO {
	return &MCPServerSTDIO{
		Command: "docker",
		Args:    []string{"run", "-l", fmt.Sprintf("mcp.client=%s", client), "--rm", "-i", "alpine/socat", "STDIO", "TCP:host.docker.internal:8811"},
	}
}

func GetUpdater(vendor string, global bool, cwd string, config Config) (Updater, error) {
	if global {
		cfg, ok := config.System[vendor]
		if !ok {
			return nil, &ErrVendorNotFound{vendor: vendor, global: global, config: config}
		}
		processor, err := NewGlobalCfgProcessor(cfg)
		if err != nil {
			return nil, err
		}
		return processor.Update, nil
	}
	projectRoot := getProjectRoot(cwd)
	if projectRoot == "" {
		return nil, errNotInGitRepo
	}
	cfg, ok := config.Project[vendor]
	if !ok {
		return nil, &ErrVendorNotFound{vendor: vendor, global: global, config: config}
	}
	processor, err := NewLocalCfgProcessor(cfg, projectRoot)
	if err != nil {
		return nil, err
	}
	return processor.Update, nil
}

type MCPClientCfgBase struct {
	DisplayName           string    `json:"displayName"`
	ConfigName            string    `json:"configName"`
	IsMCPCatalogConnected bool      `json:"dockerMCPCatalogConnected"`
	Err                   *CfgError `json:"error"`

	cfg *MCPJSONLists
}

func (c *MCPClientCfgBase) setParseResult(lists *MCPJSONLists, err error) {
	c.Err = classifyError(err)
	if lists != nil {
		if containsMCPDocker(lists.STDIOServers) {
			c.IsMCPCatalogConnected = true
		}
	}
	c.cfg = lists
}
