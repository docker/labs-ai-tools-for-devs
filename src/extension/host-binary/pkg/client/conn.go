package client

import (
	"context"
	"github.com/docker/labs-ai-tools-for-devs/pkg/generated/go/client/secrets"
	oauthapi "github.com/docker/labs-ai-tools-for-devs/pkg/generated/go/client/tools"
	"net"
	"net/http"
)

const (
	HTTPProtocol = "http"
	DummyHost    = "localhost"
)

func GetConfiguration(addr string) *secretsapi.Configuration {
	cfg := secretsapi.NewConfiguration()
	cfg.Scheme = HTTPProtocol
	cfg.Host = DummyHost
	cfg.HTTPClient = &http.Client{
		Transport: &http.Transport{
			DialContext: func(_ context.Context, _, _ string) (net.Conn, error) {
				return DialSocket(addr)
			},
		},
	}
	return cfg
}

func GetOAuthConfiguration(addr string) *oauthapi.Configuration {
	cfg := oauthapi.NewConfiguration()
	cfg.Scheme = HTTPProtocol
	cfg.Host = DummyHost
	cfg.HTTPClient = &http.Client{
		Transport: &http.Transport{
			DialContext: func(_ context.Context, _, _ string) (net.Conn, error) {
				return DialSocket(addr)
			},
		},
	}
	return cfg
}
