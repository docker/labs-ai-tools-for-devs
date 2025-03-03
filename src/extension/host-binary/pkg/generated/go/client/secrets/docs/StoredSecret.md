# StoredSecret

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Name** | **string** | the name of the secret | 
**Policies** | **[]string** | the list of policy names associated with the secret | 

## Methods

### NewStoredSecret

`func NewStoredSecret(name string, policies []string, ) *StoredSecret`

NewStoredSecret instantiates a new StoredSecret object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewStoredSecretWithDefaults

`func NewStoredSecretWithDefaults() *StoredSecret`

NewStoredSecretWithDefaults instantiates a new StoredSecret object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetName

`func (o *StoredSecret) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *StoredSecret) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *StoredSecret) SetName(v string)`

SetName sets Name field to given value.


### GetPolicies

`func (o *StoredSecret) GetPolicies() []string`

GetPolicies returns the Policies field if non-nil, zero value otherwise.

### GetPoliciesOk

`func (o *StoredSecret) GetPoliciesOk() (*[]string, bool)`

GetPoliciesOk returns a tuple with the Policies field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicies

`func (o *StoredSecret) SetPolicies(v []string)`

SetPolicies sets Policies field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


