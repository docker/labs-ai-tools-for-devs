package client

import (
	"context"
	oauthapi "github.com/docker/labs-ai-tools-for-devs/pkg/generated/go/client/tools"
)

type OAuthApiClient interface {
	// DeleteOAuthApp Unauthorizes an app.
	DeleteOAuthApp(ctx context.Context, app string) error
	// DeleteOAuthAppTool Remove a tool from an app.
	DeleteOAuthAppTool(ctx context.Context, app, tool string) error
	// GetOAuthApp Returns an app object.
	GetOAuthApp(ctx context.Context, app string) (oauthapi.OAuthApp, error)
	// ListOAuthApps Lists all app objects.
	ListOAuthApps(ctx context.Context) ([]oauthapi.OAuthApp, error)
	// PostOAuthApp Authorize an app.
	PostOAuthApp(ctx context.Context, app, scopes string) (oauthapi.AuthResponse, error)
	// PostOAuthAppTool Add a tool to an app.
	PostOAuthAppTool(ctx context.Context, app, tool string) error
}

var _ OAuthApiClient = &oauthApiClientImpl{}

type oauthApiClientImpl struct {
	*oauthapi.APIClient
}

func NewOAuthApiClient(socketPath string) OAuthApiClient {
	return &oauthApiClientImpl{
		APIClient: oauthapi.NewAPIClient(GetOAuthConfiguration(socketPath)),
	}
}

func (o oauthApiClientImpl) DeleteOAuthApp(ctx context.Context, app string) error {
	apiReq := o.ToolsApi.DeleteOAuthApp(ctx, app)
	_, err := apiReq.Execute()
	return err
}

func (o oauthApiClientImpl) DeleteOAuthAppTool(ctx context.Context, app, tool string) error {
	apiReq := o.ToolsApi.DeleteOAuthAppTool(ctx, app, tool)
	_, err := apiReq.Execute()
	return err
}

func (o oauthApiClientImpl) GetOAuthApp(ctx context.Context, app string) (oauthapi.OAuthApp, error) {
	apiReq := o.ToolsApi.GetOAuthApp(ctx, app)
	res, _, err := apiReq.Execute()
	if err != nil {
		return oauthapi.OAuthApp{}, err
	}
	return *res, nil
}

func (o oauthApiClientImpl) ListOAuthApps(ctx context.Context) ([]oauthapi.OAuthApp, error) {
	apiReq := o.ToolsApi.ListOAuthApps(ctx)
	res, _, err := apiReq.Execute()
	if err != nil {
		return nil, err
	}
	return res, nil
}

func (o oauthApiClientImpl) PostOAuthApp(ctx context.Context, app, scopes string) (oauthapi.AuthResponse, error) {
	apiReq := o.ToolsApi.PostOAuthApp(ctx, app)
	res, _, err := apiReq.Scopes(scopes).Execute()
	if err != nil {
		return oauthapi.AuthResponse{}, err
	}
	return *res, nil
}

func (o oauthApiClientImpl) PostOAuthAppTool(ctx context.Context, app, tool string) error {
	apiReq := o.ToolsApi.PostOAuthAppTool(ctx, app, tool)
	_, err := apiReq.Execute()
	return err
}

type OAuthApp struct {
	App        string        `json:"app"`
	Authorized bool          `json:"authorized"`
	Provider   string        `json:"provider"`
	Scopes     []OAuthScopes `json:"scopes,omitempty"`
	Tools      []string      `json:"tools"`
}

type OAuthScopes struct {
	Description string   `json:"description,omitempty"`
	Metadata    []string `json:"metadata,omitempty"`
	Name        string   `json:"name,omitempty"`
}

type AuthResponse struct {
	AuthType   string `json:"authType,omitempty"`
	BrowserUrl string `json:"browserUrl,omitempty"`
}
