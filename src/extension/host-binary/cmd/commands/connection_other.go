//go:build !windows
// +build !windows

package commands

import (
	"context"
	"net"

	"github.com/docker/labs-ai-tools-for-devs/pkg/paths"
)

func dialVolumeContents(ctx context.Context) (net.Conn, error) {
	path, err := paths.GetVolumeContentsSocketPath()
	if err != nil {
		return nil, err
	}

	dialer := net.Dialer{}
	return dialer.DialContext(ctx, "unix", path)
}
