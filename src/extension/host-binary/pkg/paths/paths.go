package paths

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

type Location int

const (
	OnHost = Location(iota)
	InsideContainer
)

func (l Location) String() string {
	switch l {
	case OnHost:
		return "OnHost"
	case InsideContainer:
		return "InsideContainer"
	}
	return "Unknown"
}

// Init must be called at the beginning of main. Otherwise, path length fatal errors might occur later on.
func Init(l Location) error {
	if l != OnHost {
		return nil
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("accessing home dir path: %s", err)
	}
	// Set the current directory to allow the use of shortened relative socket paths on Mac and Linux.
	if err := os.Chdir(getUserDataDirectory(home, true)); err != nil {
		return &os.PathError{Op: "chdir", Path: home, Err: err}
	}
	return nil
}

func getUserDataDirectory(home string, winLocal bool) string {
	if runtime.GOOS == "windows" && winLocal {
		return filepath.Join(home, "AppData", "Local", "Docker")
	}
	if runtime.GOOS == "windows" && !winLocal {
		return filepath.Join(home, "AppData", "Roaming", "Docker")
	}
	if runtime.GOOS == "darwin" {
		return filepath.Join(home, "Library", "Containers", "com.docker.docker", "Data")
	}
	return filepath.Join(home, ".docker", "desktop")
}
