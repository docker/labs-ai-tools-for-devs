package commands

import (
	"context"
	"fmt"
	"os/user"

	"github.com/spf13/cobra"
)

func CurrentUser(ctx context.Context) *cobra.Command {
	return &cobra.Command{
		Use:   "current-user",
		Short: "Get the current user",
		Args:  cobra.NoArgs,
		RunE: func(*cobra.Command, []string) error {
			user, err := user.Current()
			if err != nil {
				return err
			}
			fmt.Print(user.Username)
			return nil
		},
	}
}
