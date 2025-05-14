package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"slices"
	"syscall"

	"github.com/docker/labs-ai-tools-for-devs/pkg/client"
	"github.com/docker/labs-ai-tools-for-devs/pkg/clients"
	"github.com/docker/labs-ai-tools-for-devs/pkg/commands"
	secretsapi "github.com/docker/labs-ai-tools-for-devs/pkg/generated/go/client/secrets"
	"github.com/docker/labs-ai-tools-for-devs/pkg/paths"
	"github.com/spf13/cobra"
)

func main() {
	// We need to preserve CWD as paths.Init will change it.
	originalCwd, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
		return
	}

	ctx, closeFunc := newSigContext()
	defer closeFunc()
	paths.Init(paths.OnHost)
	cmd := AddSecret(ctx)
	cmd.AddCommand(ListSecrets(ctx))
	cmd.AddCommand(DeleteSecret(ctx))
	cmd.AddCommand(AuthorizeApp(ctx))
	cmd.AddCommand(UnauthorizeApp(ctx))
	cmd.AddCommand(ListOAuthApps(ctx))
	cmd.AddCommand(DeriveSecret(ctx))
	cmd.AddCommand(commands.CurrentUser(ctx))
	cmd.AddCommand(commands.ReadFromVolume(ctx))
	cmd.AddCommand(commands.WriteToVolume(ctx))
	cmd.AddCommand(clients.NewClientCmd(ctx, originalCwd))
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

func newOAuthApiClient() (client.OAuthApiClient, error) {
	p, err := paths.GetToolsApiSocketPath()
	if err != nil {
		return nil, err
	}
	return client.NewOAuthApiClient(p), nil
}

func ListOAuthApps(ctx context.Context) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-oauth-apps",
		Short: "List all OAuth apps",
		Args:  cobra.NoArgs,
		RunE: func(*cobra.Command, []string) error {
			return runListOAuthApps(ctx)
		},
	}
	return cmd
}

func runListOAuthApps(ctx context.Context) error {
	c, err := newOAuthApiClient()
	if err != nil {
		return err
	}
	apps, err := c.ListOAuthApps(ctx)
	if err != nil {
		return err
	}
	return json.NewEncoder(os.Stdout).Encode(apps)
}

type authorizeOptions struct {
	Name   string
	Scopes string
}

func AuthorizeApp(ctx context.Context) *cobra.Command {
	opts := &authorizeOptions{}
	cmd := &cobra.Command{
		Use:   "authorize",
		Short: "Authorize an OAuth app",
		Args:  cobra.NoArgs,
		RunE: func(*cobra.Command, []string) error {
			return runAuthorizeApp(ctx, *opts)
		},
	}
	flags := cmd.Flags()
	flags.StringVarP(&opts.Name, "name", "n", "", "Name of the OAuth app")
	_ = cmd.MarkFlagRequired("name")
	flags.StringVarP(&opts.Scopes, "scopes", "s", "", "Scopes for the OAuth app")
	return cmd
}

func runAuthorizeApp(ctx context.Context, opts authorizeOptions) error {
	c, err := newOAuthApiClient()
	if err != nil {
		return err
	}
	authResponse, err := c.PostOAuthApp(ctx, opts.Name, opts.Scopes)
	if err != nil {
		return err
	}
	return json.NewEncoder(os.Stdout).Encode(authResponse)
}

type unauthorizeOptions struct {
	Name string
}

func UnauthorizeApp(ctx context.Context) *cobra.Command {
	opts := &unauthorizeOptions{}
	cmd := &cobra.Command{
		Use:   "unauthorize",
		Short: "Unauthorize an OAuth app",
		Args:  cobra.NoArgs,
		RunE: func(*cobra.Command, []string) error {
			return runUnauthorizeApp(ctx, *opts)
		},
	}
	flags := cmd.Flags()
	flags.StringVarP(&opts.Name, "name", "n", "", "Name of the OAuth app")
	_ = cmd.MarkFlagRequired("name")
	return cmd
}

func runUnauthorizeApp(ctx context.Context, opts unauthorizeOptions) error {
	c, err := newOAuthApiClient()
	if err != nil {
		return err
	}
	err = c.DeleteOAuthApp(ctx, opts.Name)
	if err != nil {
		return err
	}
	fmt.Printf("App %s has been unauthorised\n", opts.Name)
	return nil
}

type addOptions struct {
	Name   string
	Value  string
	Base64 bool
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
	flags.BoolVar(&opts.Base64, "base64", false, "Is the value base64 encoded")
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
		Args:  cobra.NoArgs,
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
	if isOldVersion(ctx, c) {
		if err := assertMcpPolicyExists(ctx, c); err != nil {
			return err
		}
	} else {
		cmd := exec.Command("docker", "mcp", "policy", "set", "* allows any-process")
		_ = cmd.Run()
	}
	value := opts.Value
	if opts.Base64 {
		decodedValue, err := base64.StdEncoding.DecodeString(value)
		if err != nil {
			return fmt.Errorf("failed to decode base64 value: %w", err)
		}
		value = string(decodedValue)
	}

	return c.SetSecret(ctx, secretsapi.Secret{Name: opts.Name, Value: value, Policies: []string{mcpPolicyName}})
}

func isOldVersion(ctx context.Context, apiClient client.ApiClient) bool {
	_, err := apiClient.ListPolicies(ctx) // This endpoint has been removed on the new API -> if it exists, it must be the old
	return err == nil
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

type deriveOptions struct {
	Src string
	Dst string
}

func DeriveSecret(ctx context.Context) *cobra.Command {
	opts := &deriveOptions{}
	cmd := &cobra.Command{
		Use:   "derive",
		Short: "Derive a secret from another secret",
		Args:  cobra.NoArgs,
		RunE: func(*cobra.Command, []string) error {
			return runDeriveSecret(ctx, *opts)
		},
	}
	flags := cmd.Flags()
	flags.StringVarP(&opts.Src, "src", "s", "", "Name of the source secret")
	_ = cmd.MarkFlagRequired("src")
	flags.StringVarP(&opts.Dst, "dst", "d", "", "Name of the destination secret")
	_ = cmd.MarkFlagRequired("dst")
	return cmd
}

func runDeriveSecret(ctx context.Context, opts deriveOptions) error {
	c, err := newApiClient()
	if err != nil {
		return err
	}
	if err := assertMcpPolicyExists(ctx, c); err != nil {
		return err
	}
	s, err := c.GetSecret(ctx, opts.Src)
	if err != nil {
		return err
	}
	if !slices.Contains(s.Policies, mcpPolicyName) {
		s.Policies = append(s.Policies, mcpPolicyName)
	}
	return c.SetSecret(ctx, secretsapi.Secret{Name: opts.Dst, Value: s.Value, Policies: s.Policies})
}
