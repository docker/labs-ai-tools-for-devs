package commands

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"

	"github.com/spf13/cobra"
)

type FileContent struct {
	VolumeId   string `json:"volumeId"`
	TargetPath string `json:"targetPath"`
	Contents   string `json:"contents"`
}

func ReadFromVolume(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "read-from-volume",
		Short: "Read a file from the extension's volume",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			filename := args[0]

			var content FileContent
			if err := get(ctx, httpClient(), "/volume-file-content?volumeId=docker-prompts&targetPath="+filename, &content); err != nil {
				return err
			}

			fmt.Print(content.Contents)
			return nil
		},
	}
}

func WriteToVolume(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "write-to-volume",
		Short: "Write some base64 encoded content to a file on the extension's volume",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			filename := args[0]
			contentBase64 := args[1]

			content, err := base64.StdEncoding.DecodeString(contentBase64)
			if err != nil {
				return err
			}

			return post(ctx, httpClient(), "/volume-file-content", FileContent{
				VolumeId:   "docker-prompts",
				TargetPath: filename,
				Contents:   string(content),
			})
		},
	}
}

func httpClient() *http.Client {
	return &http.Client{
		Transport: &http.Transport{
			DialContext: func(ctx context.Context, _, _ string) (conn net.Conn, err error) {
				return dialVolumeContents(ctx)
			},
		},
	}
}

func get(ctx context.Context, httpClient *http.Client, endpoint string, v any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "http://localhost"+endpoint, nil)
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

func post(ctx context.Context, httpClient *http.Client, endpoint string, v any) error {
	payload, err := json.Marshal(v)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "http://localhost"+endpoint, bytes.NewReader(payload))
	if err != nil {
		return err
	}
	req.Header.Set("X-DockerDesktop-Host", "vm.docker.internal")
	req.Header.Set("Content-Type", "application/json")

	response, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	_, err = io.ReadAll(response.Body)
	if err != nil {
		return err
	}

	return nil
}
