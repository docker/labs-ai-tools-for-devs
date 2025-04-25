package client

import (
	"context"
	"github.com/docker/labs-ai-tools-for-devs/pkg/generated/go/client/secrets"
)

type ApiClient interface {
	// DeletePolicy deletes a policy
	DeletePolicy(ctx context.Context, policy string) error
	// DeleteSecret deletes a secret
	DeleteSecret(ctx context.Context, secret string) error
	// GetPolicy retrieves a policy
	GetPolicy(ctx context.Context, policy string) (secretsapi.Policy, error)
	// GetSecret checks if a secret exists
	GetSecret(ctx context.Context, secret string) (secretsapi.StoredSecret, error)
	// ListPolicies lists all policies
	ListPolicies(ctx context.Context) ([]secretsapi.Policy, error)
	// ListSecrets lists all secrets
	ListSecrets(ctx context.Context) ([]secretsapi.StoredSecret, error)
	// SetPolicy sets the policy
	SetPolicy(ctx context.Context, policy secretsapi.Policy) error
	// SetSecret sets a secret value
	SetSecret(ctx context.Context, secret secretsapi.Secret) error
}

var _ ApiClient = &apiClientImpl{}

type apiClientImpl struct {
	*secretsapi.APIClient
}

func NewApiClient(socketPath string) ApiClient {
	return &apiClientImpl{
		APIClient: secretsapi.NewAPIClient(GetConfiguration(socketPath)),
	}
}

func (d apiClientImpl) SetSecret(ctx context.Context, s secretsapi.Secret) error {
	apiReq := d.SecretsApi.SetJfsSecret(ctx)
	req := secretsapi.NewSecret(s.Name, s.Value)
	req.SetPolicies(s.Policies)
	_, err := apiReq.Secret(*req).Execute()
	return err
}

func (d apiClientImpl) DeleteSecret(ctx context.Context, name string) error {
	apiReq := d.SecretsApi.DeleteJfsSecret(ctx, name)
	_, err := apiReq.Execute()
	return err
}

func (d apiClientImpl) ListSecrets(ctx context.Context) ([]secretsapi.StoredSecret, error) {
	apiReq := d.SecretsApi.ListJfsSecrets(ctx)
	res, _, err := apiReq.Execute()
	return res, err
}

func (d apiClientImpl) GetSecret(ctx context.Context, secret string) (secretsapi.StoredSecret, error) {
	apiReq := d.SecretsApi.GetJfsSecret(ctx, secret)
	res, _, err := apiReq.Execute()
	if err != nil {
		return secretsapi.StoredSecret{}, err
	}
	return *res, nil
}

func (d apiClientImpl) DeletePolicy(ctx context.Context, policy string) error {
	apiReq := d.SecretsApi.DeleteJfsPolicy(ctx, policy)
	_, err := apiReq.Execute()
	return err
}

func (d apiClientImpl) GetPolicy(ctx context.Context, policy string) (secretsapi.Policy, error) {
	apiReq := d.SecretsApi.GetJfsPolicy(ctx, policy)
	res, _, err := apiReq.Execute()
	if err != nil {
		return secretsapi.Policy{}, err
	}
	return *res, nil
}

func (d apiClientImpl) ListPolicies(ctx context.Context) ([]secretsapi.Policy, error) {
	apiReq := d.SecretsApi.ListJfsPolicies(ctx)
	res, _, err := apiReq.Execute()
	return res, err
}

func (d apiClientImpl) SetPolicy(ctx context.Context, policy secretsapi.Policy) error {
	apiReq := d.SecretsApi.SetJfsPolicy(ctx)
	_, err := apiReq.Policy(policy).Execute()
	return err
}
