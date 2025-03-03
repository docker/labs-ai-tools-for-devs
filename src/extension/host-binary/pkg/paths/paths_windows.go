//go:build windows

package paths

func GetSecretsApiSocketPath() (string, error) {
	return `//./pipe/dockerJfs`, nil
}
