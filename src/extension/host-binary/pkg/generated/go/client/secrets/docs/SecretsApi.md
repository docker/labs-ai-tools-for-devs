# \SecretsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**DeleteJfsPolicy**](SecretsApi.md#DeleteJfsPolicy) | **Delete** /policies/{policy} | deletes a policy
[**DeleteJfsSecret**](SecretsApi.md#DeleteJfsSecret) | **Delete** /secrets/{secret} | deletes a secret
[**GetJfsPolicy**](SecretsApi.md#GetJfsPolicy) | **Get** /policies/{policy} | retrieves a policy
[**GetJfsSecret**](SecretsApi.md#GetJfsSecret) | **Get** /secrets/{secret} | checks if a secret exists
[**ListJfsPolicies**](SecretsApi.md#ListJfsPolicies) | **Get** /policies | lists all policies
[**ListJfsSecrets**](SecretsApi.md#ListJfsSecrets) | **Get** /secrets | lists all secrets
[**SetJfsPolicy**](SecretsApi.md#SetJfsPolicy) | **Post** /policies | sets the policy
[**SetJfsSecret**](SecretsApi.md#SetJfsSecret) | **Post** /secrets | sets a secret value



## DeleteJfsPolicy

> DeleteJfsPolicy(ctx, policy).Execute()

deletes a policy

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {
    policy := "policy_example" // string | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.DeleteJfsPolicy(context.Background(), policy).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.DeleteJfsPolicy``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policy** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteJfsPolicyRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

 (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteJfsSecret

> DeleteJfsSecret(ctx, secret).Execute()

deletes a secret

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {
    secret := "secret_example" // string | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.DeleteJfsSecret(context.Background(), secret).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.DeleteJfsSecret``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**secret** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteJfsSecretRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

 (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetJfsPolicy

> Policy GetJfsPolicy(ctx, policy).Execute()

retrieves a policy

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {
    policy := "policy_example" // string | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.GetJfsPolicy(context.Background(), policy).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.GetJfsPolicy``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `GetJfsPolicy`: Policy
    fmt.Fprintf(os.Stdout, "Response from `SecretsApi.GetJfsPolicy`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policy** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetJfsPolicyRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**Policy**](Policy.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetJfsSecret

> StoredSecret GetJfsSecret(ctx, secret).Execute()

checks if a secret exists

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {
    secret := "secret_example" // string | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.GetJfsSecret(context.Background(), secret).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.GetJfsSecret``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `GetJfsSecret`: StoredSecret
    fmt.Fprintf(os.Stdout, "Response from `SecretsApi.GetJfsSecret`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**secret** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetJfsSecretRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**StoredSecret**](StoredSecret.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListJfsPolicies

> []Policy ListJfsPolicies(ctx).Execute()

lists all policies

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.ListJfsPolicies(context.Background()).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.ListJfsPolicies``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `ListJfsPolicies`: []Policy
    fmt.Fprintf(os.Stdout, "Response from `SecretsApi.ListJfsPolicies`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiListJfsPoliciesRequest struct via the builder pattern


### Return type

[**[]Policy**](Policy.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListJfsSecrets

> []StoredSecret ListJfsSecrets(ctx).Execute()

lists all secrets

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.ListJfsSecrets(context.Background()).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.ListJfsSecrets``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `ListJfsSecrets`: []StoredSecret
    fmt.Fprintf(os.Stdout, "Response from `SecretsApi.ListJfsSecrets`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiListJfsSecretsRequest struct via the builder pattern


### Return type

[**[]StoredSecret**](StoredSecret.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SetJfsPolicy

> SetJfsPolicy(ctx).Policy(policy).Execute()

sets the policy

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {
    policy := *openapiclient.NewPolicy("Name_example") // Policy | the policy to be set

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.SetJfsPolicy(context.Background()).Policy(policy).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.SetJfsPolicy``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSetJfsPolicyRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **policy** | [**Policy**](Policy.md) | the policy to be set | 

### Return type

 (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SetJfsSecret

> SetJfsSecret(ctx).Secret(secret).Execute()

sets a secret value

### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "./openapi"
)

func main() {
    secret := *openapiclient.NewSecret("Name_example", "Value_example") // Secret | the secret to be set

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.SecretsApi.SetJfsSecret(context.Background()).Secret(secret).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `SecretsApi.SetJfsSecret``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSetJfsSecretRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **secret** | [**Secret**](Secret.md) | the secret to be set | 

### Return type

 (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

