package docker

import (
	"fmt"
	"io"
	"os"
	"os/signal"
	"syscall"

	ocispec "github.com/opencontainers/image-spec/specs-go/v1"
	"github.com/spf13/cobra"

	"github.com/docker/cli/cli/command"
	cliflags "github.com/docker/cli/cli/flags"
	"github.com/docker/cli/cli/streams"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/pkg/jsonmessage"
)

func StartContainer(c *cobra.Command, cli command.Cli) error {
	// Create signal channel to handle SIGINT and SIGTERM
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	ctx := c.Context()
	dc := cli.Client()

	// Pull the mcp/inspector image
	responseBody, err := dc.ImagePull(ctx, "vonwig/prompts", image.PullOptions{})
	if err != nil {
		fmt.Println("error pulling image:", err)
		return err
	}

	// Print the response
	defer responseBody.Close() // nolint: errcheck

	// Display the pull response
	out := streams.NewOut(io.Discard)
	// out := cli.Out()
	err = jsonmessage.DisplayJSONMessagesToStream(responseBody, out, nil)
	if err != nil {
		fmt.Println("error displaying pull response:", err)
		return err
	}

	resp, err := dc.ContainerCreate(ctx, &container.Config{
		Image:        "vonwig/prompts",
		AttachStderr: true,
		AttachStdout: true,
		Tty:          true,
		OpenStdin:    true,
	}, &container.HostConfig{
		Mounts: []mount.Mount{
			{
				Type:   mount.TypeBind,
				Source: "/var/run/docker.sock",
				Target: "/var/run/docker.sock",
			},
		},
	}, &network.NetworkingConfig{}, &ocispec.Platform{}, "")
	if err != nil {
		fmt.Println("error creating inspector container:", err)
		return err
	}

	if err := dc.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		fmt.Println("error starting inspector:", err)
		return err
	}

	// Stream container logs
	stream := func() {
		logs, err := dc.ContainerLogs(ctx, resp.ID, container.LogsOptions{
			ShowStdout: true,
			ShowStderr: true,
			Follow:     true, // Stream logs
		})
		if err != nil {
			fmt.Println("error getting logs:", err)
			return
		}
		defer logs.Close() // nolint: errcheck

		// Copy logs to stdout
		_, err = io.Copy(cli.Out(), logs)
		if err != nil && err != io.EOF {
			fmt.Println("error copying logs:", err)
			return
		}
	}

	go stream()

	// Cleanup function
	cleanup := func() {
		if err := dc.ContainerRemove(ctx, resp.ID, container.RemoveOptions{
			Force:         true,
			RemoveVolumes: true,
		}); err != nil {
			fmt.Printf("error removing inspector: %v\n", err)
		}
	}

	// Handle signals
	go func() {
		<-sigChan
		cleanup()
		os.Exit(0)
	}()

	// Ensure cleanup on normal exit
	defer cleanup()

	// Wait for container to stop
	statusCh, errCh := dc.ContainerWait(
		ctx,
		resp.ID,
		container.WaitConditionNotRunning,
	)

	select {
	case err := <-errCh:
		if err != nil {
			return err
		}

	case status := <-statusCh:
		// Container has stopped
		fmt.Println("")
		fmt.Println("mcp/docker failed")
		os.Exit(int(status.StatusCode))
		return nil
	}

	return nil
}

func Main() {
	cli, err := command.NewDockerCli()
	if err != nil {
		_, _ = fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	cli.Initialize(&cliflags.ClientOptions{})

	cmd := &cobra.Command{
		Use:   "mcp",
		Short: "for mcp",
		RunE: func(c *cobra.Command, _ []string) error {
			StartContainer(c, cli)
			return nil
		},
	}
	cmd.Execute()
}
