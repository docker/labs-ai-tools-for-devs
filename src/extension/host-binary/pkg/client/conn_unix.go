//go:build !windows
// +build !windows

package client

import "net"

func DialSocket(socket string) (net.Conn, error) {
	return net.Dial("unix", socket)
}
