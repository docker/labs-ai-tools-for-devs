EXTENSION:=
OPENAPI_GENERATOR_VERSION ?= v6.0.1
DD_API_NAME=secrets
DD_API_PKGNAME=api
BINARY?=host-binary


STATIC_FLAGS=CGO_ENABLED=0
LDFLAGS="-s -w"
GO_BUILD=$(STATIC_FLAGS) go build -trimpath -ldflags=$(LDFLAGS)

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m

.PHONY: bin
bin:  ## Build the binary for the current platform
	@echo "$(INFO_COLOR)Building...$(NO_COLOR)"
	$(GO_BUILD) -o bin/$(BINARY)$(EXTENSION) ./cmd

lint:
	golangci-lint run

format:
	go fmt ./...


cross: ## Cross compile the server
	GOOS=linux  GOARCH=amd64 $(GO_BUILD) -o dist/linux-amd64/$(BINARY) ./cmd
	GOOS=linux  GOARCH=arm64 $(GO_BUILD) -o dist/linux-arm64/$(BINARY) ./cmd
	GOOS=darwin  GOARCH=amd64 $(GO_BUILD) -o dist/darwin-amd64/$(BINARY) ./cmd
	GOOS=darwin  GOARCH=arm64 $(GO_BUILD) -o dist/darwin-arm64/$(BINARY) ./cmd
	GOOS=windows GOARCH=amd64 $(GO_BUILD) -o dist/windows-amd64/$(BINARY).exe ./cmd
	GOOS=windows GOARCH=arm64 $(GO_BUILD) -o dist/windows-arm64/$(BINARY).exe ./cmd

package: ## package the server binaries
	tar -C dist/linux-amd64 -czf dist/$(BINARY)-linux-amd64.tar.gz $(BINARY)
	tar -C dist/linux-arm64 -czf dist/$(BINARY)-linux-arm64.tar.gz $(BINARY)
	tar -C dist/darwin-amd64 -czf dist/$(BINARY)-darwin-amd64.tar.gz $(BINARY)
	tar -C dist/darwin-arm64 -czf dist/$(BINARY)-darwin-arm64.tar.gz $(BINARY)
	tar -C dist/windows-amd64 -czf dist/$(BINARY)-windows-amd64.tar.gz $(BINARY).exe
	tar -C dist/windows-arm64 -czf dist/$(BINARY)-windows-arm64.tar.gz $(BINARY).exe

help: ## Show this help
	@echo Please specify a build target. The choices are:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(NO_COLOR) %s\n", $$1, $$2}'



pre-gen-clients:
	rm -rf ./pkg/generated/go/client/$(DD_API_NAME)

gen-go-client:
	docker run --rm -w /local -e JAVA_OPTS='-Dlog.level=error' -v ${PWD}:/local openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} \
		generate -g go -i ./api/schemas/$(DD_API_NAME).yaml \
		-o ./pkg/generated/go/client/$(DD_API_NAME) \
		--http-user-agent "Docker Desktop API" \
		--additional-properties=packageName=$(DD_API_PKGNAME) \
		--additional-properties=enumClassPrefix=true \
		--additional-properties=generateInterfaces=true \
		--additional-properties=isGoSubmodule=false

gen-secrets-api-html:
	docker run --rm -w /local -e JAVA_OPTS='-Dlog.level=error' -v ${PWD}:/local openapitools/openapi-generator-cli:${OPENAPI_GENERATOR_VERSION} \
		generate -g html2 -i ./api/schemas/$(DD_API_NAME).yaml \
		-o ./pkg/generated/go/client/$(DD_API_NAME)/html

post-gen-go-client:
	rm -rf \
		./pkg/generated/go/client/$(DD_API_NAME)/.gitignore \
		./pkg/generated/go/client/$(DD_API_NAME)/.openapi-generator-ignore \
		./pkg/generated/go/client/$(DD_API_NAME)/.travis.yml \
		./pkg/generated/go/client/$(DD_API_NAME)/go.* \
		./pkg/generated/go/client/$(DD_API_NAME)/git_push.sh

generate-sm: DD_API_NAME=secrets
generate-sm: DD_API_PKGNAME=secretsapi
generate-sm: pre-gen-clients gen-go-client gen-secrets-api-html post-gen-go-client

generate-oauth: DD_API_NAME=tools
generate-oauth: DD_API_PKGNAME=oauthapi
generate-oauth: pre-gen-clients gen-go-client gen-secrets-api-html post-gen-go-client

generate: generate-sm generate-oauth
