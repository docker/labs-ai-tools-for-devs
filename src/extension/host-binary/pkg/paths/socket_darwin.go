package paths

import (
	"os"
	"path/filepath"
)

func dockerDesktopSocketDir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, "Library", "Containers", "com.docker.docker", "Data"), nil
}
