# OAuthApp

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**App** | **string** |  | 
**Tools** | **[]string** |  | 
**Authorized** | **bool** |  | 
**Provider** | **string** |  | 
**Scopes** | Pointer to [**[]OAuthScopes**](OAuthScopes.md) |  | [optional] 

## Methods

### NewOAuthApp

`func NewOAuthApp(app string, tools []string, authorized bool, provider string, ) *OAuthApp`

NewOAuthApp instantiates a new OAuthApp object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOAuthAppWithDefaults

`func NewOAuthAppWithDefaults() *OAuthApp`

NewOAuthAppWithDefaults instantiates a new OAuthApp object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetApp

`func (o *OAuthApp) GetApp() string`

GetApp returns the App field if non-nil, zero value otherwise.

### GetAppOk

`func (o *OAuthApp) GetAppOk() (*string, bool)`

GetAppOk returns a tuple with the App field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetApp

`func (o *OAuthApp) SetApp(v string)`

SetApp sets App field to given value.


### GetTools

`func (o *OAuthApp) GetTools() []string`

GetTools returns the Tools field if non-nil, zero value otherwise.

### GetToolsOk

`func (o *OAuthApp) GetToolsOk() (*[]string, bool)`

GetToolsOk returns a tuple with the Tools field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTools

`func (o *OAuthApp) SetTools(v []string)`

SetTools sets Tools field to given value.


### GetAuthorized

`func (o *OAuthApp) GetAuthorized() bool`

GetAuthorized returns the Authorized field if non-nil, zero value otherwise.

### GetAuthorizedOk

`func (o *OAuthApp) GetAuthorizedOk() (*bool, bool)`

GetAuthorizedOk returns a tuple with the Authorized field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAuthorized

`func (o *OAuthApp) SetAuthorized(v bool)`

SetAuthorized sets Authorized field to given value.


### GetProvider

`func (o *OAuthApp) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *OAuthApp) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *OAuthApp) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetScopes

`func (o *OAuthApp) GetScopes() []OAuthScopes`

GetScopes returns the Scopes field if non-nil, zero value otherwise.

### GetScopesOk

`func (o *OAuthApp) GetScopesOk() (*[]OAuthScopes, bool)`

GetScopesOk returns a tuple with the Scopes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScopes

`func (o *OAuthApp) SetScopes(v []OAuthScopes)`

SetScopes sets Scopes field to given value.

### HasScopes

`func (o *OAuthApp) HasScopes() bool`

HasScopes returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


