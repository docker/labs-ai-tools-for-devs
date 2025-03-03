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
	return filepath.Join(home, ".docker", "desktop"), nil
}
