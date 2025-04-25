# OAuthScopes

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Name** | Pointer to **string** |  | [optional] 
**Description** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **[]string** |  | [optional] 

## Methods

### NewOAuthScopes

`func NewOAuthScopes() *OAuthScopes`

NewOAuthScopes instantiates a new OAuthScopes object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOAuthScopesWithDefaults

`func NewOAuthScopesWithDefaults() *OAuthScopes`

NewOAuthScopesWithDefaults instantiates a new OAuthScopes object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetName

`func (o *OAuthScopes) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *OAuthScopes) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *OAuthScopes) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *OAuthScopes) HasName() bool`

HasName returns a boolean if a field has been set.

### GetDescription

`func (o *OAuthScopes) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *OAuthScopes) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *OAuthScopes) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *OAuthScopes) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### GetMetadata

`func (o *OAuthScopes) GetMetadata() []string`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *OAuthScopes) GetMetadataOk() (*[]string, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *OAuthScopes) SetMetadata(v []string)`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *OAuthScopes) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


