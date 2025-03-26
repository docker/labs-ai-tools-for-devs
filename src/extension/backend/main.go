package main

import (
	"flag"
	"os"

	"github.com/docker/dait/internal/api"
)

func main() {
	var socketPath string
	flag.StringVar(&socketPath, "socket", "/run/guest-services/backend.sock", "Unix domain socket to listen on")
	flag.Parse()

	err := os.RemoveAll(socketPath)
	if err != nil {
		panic(err)
	}
	err = api.Run(socketPath)
	if err != nil {
		panic(err)
	}
}
