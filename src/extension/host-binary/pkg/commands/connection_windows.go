package commands

import (
	"context"
	"net"

	"github.com/Microsoft/go-winio"
	"github.com/docker/labs-ai-tools-for-devs/pkg/paths"
)

func dialVolumeContents(ctx context.Context) (net.Conn, error) {
	path, err := paths.GetVolumeContentsSocketPath()
	if err != nil {
		return nil, err
	}

	return winio.DialPipeContext(ctx, path)
}
