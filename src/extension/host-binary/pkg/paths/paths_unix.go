//go:build unix

package paths

import "path/filepath"

func GetSecretsApiSocketPath() (string, error) {
	dir, err := dockerDesktopSocketDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "jfs.sock"), nil
}

func GetToolsApiSocketPath() (string, error) {
	dir, err := dockerDesktopSocketDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "tools.sock"), nil
}
