package client

import (
	"github.com/Microsoft/go-winio"
	"net"
	"time"
)

func DialSocket(socket string) (net.Conn, error) {
	timeout := time.Second
	return winio.DialPipe(socket, &timeout)
}
