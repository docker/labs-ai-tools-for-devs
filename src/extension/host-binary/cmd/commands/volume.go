package commands

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"

	"github.com/spf13/cobra"
)

func ReadFromVolume(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "read-from-volume",
		Short: "Read a file from the extension's volume",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			content, err := readConfig(ctx, args[0])
			if err != nil {
				return err
			}
			fmt.Print(content)
			return nil
		},
	}
}

func readConfig(ctx context.Context, filename string) (string, error) {
	httpClient := &http.Client{
		Transport: &http.Transport{
			DialContext: func(ctx context.Context, _, _ string) (conn net.Conn, err error) {
				return dialVolumeContents(ctx)
			},
		},
	}

	var content struct {
		Contents string `json:"contents"`
	}
	if err := query(ctx, httpClient, "GET", "/volume-file-content?volumeId=docker-prompts&targetPath="+filename, &content); err != nil {
		return "", err
	}

	return content.Contents, nil
}

func query(ctx context.Context, httpClient *http.Client, method string, endpoint string, v any) error {
	req, err := http.NewRequestWithContext(ctx, method, "http://localhost"+endpoint, nil)
	if err != nil {
		return err
	}
	req.Header.Set("X-DockerDesktop-Host", "vm.docker.internal")

	response, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	buf, err := io.ReadAll(response.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(buf, &v); err != nil {
		return err
	}
	return nil
}
