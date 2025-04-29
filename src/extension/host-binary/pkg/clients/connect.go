package clients

import (
	"context"
	"fmt"
	"strings"

	"github.com/spf13/cobra"
)

type connectOpts struct {
	Global bool
	Quiet  bool
}

func ConnectCommand(ctx context.Context, cwd string, cfg Config) *cobra.Command {
	opts := &connectOpts{}
	cmd := &cobra.Command{
		Use:   fmt.Sprintf("connect [OPTIONS] <mcp-client>\n\nSupported clients: %s", strings.Join(getSupportedMCPClients(cfg), " ")),
		Short: "Connect the Docker MCP Catalog to a client.",
		RunE: func(_ *cobra.Command, args []string) error {
			return runConnect(ctx, cwd, cfg, args[0], *opts)
		},
		Args: cobra.ExactArgs(1),
	}
	flags := cmd.Flags()
	addGlobalFlag(flags, &opts.Global)
	addQuietFlag(flags, &opts.Quiet)
	return cmd
}

func runConnect(ctx context.Context, cwd string, config Config, vendor string, opts connectOpts) error {
	if vendor == vendorGordon && opts.Global {
		if err := connectGordon(ctx); err != nil {
			return err
		}
	} else {
		updater, err := GetUpdater(vendor, opts.Global, cwd, config)
		if err != nil {
			return err
		}
		if err := updater(DockerMCPCatalog, newMCPGatewayServer(vendor)); err != nil {
			return err
		}
	}
	if opts.Quiet {
		return nil
	}
	if err := runList(ctx, cwd, config, listOptions{Global: opts.Global}); err != nil {
		return err
	}
	fmt.Printf("You might have to restart '%s'.\n", vendor)
	return nil
}
