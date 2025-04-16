package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	secretsapi "github.com/docker/labs-ai-tools-for-devs/pkg/generated/go/client/secrets"
	"github.com/docker/labs-ai-tools-for-devs/pkg/client"
	"github.com/docker/labs-ai-tools-for-devs/pkg/paths"
	"github.com/spf13/cobra"
)

func main() {
	ctx, closeFunc := newSigContext()
	defer closeFunc()
	paths.Init(paths.OnHost)
	cmd := AddSecret(ctx)
	cmd.AddCommand(ListSecrets(ctx))
	cmd.AddCommand(DeleteSecret(ctx))
	if err := cmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func newSigContext() (context.Context, func()) {
	ctx, cancel := context.WithCancel(context.Background())
	s := make(chan os.Signal, 1)
	signal.Notify(s, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		<-s
		cancel()
	}()
	return ctx, cancel
}

func newApiClient() (client.ApiClient, error) {
	p, err := paths.GetSecretsApiSocketPath()
	if err != nil {
		return nil, err
	}
	return client.NewApiClient(p), nil
}

type addOptions struct {
	Name  string
	Value string
}

type deleteOptions struct {
	Name string
}

func AddSecret(ctx context.Context) *cobra.Command {
	opts := &addOptions{}
	cmd := &cobra.Command{
		Use:   "add",
		Short: "Add a secret for an MCP tool/container.",
		Args:  cobra.NoArgs,
		RunE: func(*cobra.Command, []string) error {
			return runAddSecret(ctx, *opts)
		},
	}
	flags := cmd.Flags()
	flags.StringVarP(&opts.Name, "name", "n", "", "Name of the secret")
	_ = cmd.MarkFlagRequired("name")
	flags.StringVarP(&opts.Value, "value", "v", "", "Value of the secret")
	_ = cmd.MarkFlagRequired("value")
	return cmd
}

func ListSecrets(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list",
		Short: "List all secrets",
		Args:  cobra.NoArgs,
		RunE: func(*cobra.Command, []string) error {
			return runListSecrets(ctx)
		},
	}
	return cmd
}

func DeleteSecret(ctx context.Context) *cobra.Command {
	opts := &deleteOptions{}
	cmd := &cobra.Command{
		Use:   "delete",	
		Short: "Delete a secret",
		Args:  cobra.ExactArgs(1),
		RunE: func(*cobra.Command, []string) error {
			return runDeleteSecret(ctx, *opts)
		},
	}
	flags := cmd.Flags()
	flags.StringVarP(&opts.Name, "name", "n", "", "Name of the secret")
	_ = cmd.MarkFlagRequired("name")
	return cmd
}

const mcpPolicyName = "MCP"

func runAddSecret(ctx context.Context, opts addOptions) error {
	c, err := newApiClient()
	if err != nil {
		return err
	}
	if err := assertMcpPolicyExists(ctx, c); err != nil {
		return err
	}
	return c.SetSecret(ctx, secretsapi.Secret{Name: opts.Name, Value: opts.Value, Policies: []string{mcpPolicyName}})
}

func runListSecrets(ctx context.Context) error {
	c, err := newApiClient()
	if err != nil {
		return err
	}
	secrets, err := c.ListSecrets(ctx)
	if err != nil {
		return err
	}
	return json.NewEncoder(os.Stdout).Encode(secrets)
}

func runDeleteSecret(ctx context.Context, opts deleteOptions) error {
	c, err := newApiClient()
	if err != nil {
		return err
	}
	return c.DeleteSecret(ctx, opts.Name)
}

func assertMcpPolicyExists(ctx context.Context, apiClient client.ApiClient) error {
	return apiClient.SetPolicy(ctx, secretsapi.Policy{Name: mcpPolicyName, Images: []string{"*"}})
}
