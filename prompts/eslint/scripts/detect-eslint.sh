#/bin/bash

# Detect ESLint eslintrc or eslint.config
ESLINTRC_PATTERN=".eslintrc*"

ESLINTCONFIG_PATTERN="eslint.config.*"

FILES=$(fd --hidden -g $ESLINTRC_PATTERN .)
FILES+=$(fd -g $ESLINTCONFIG_PATTERN .)

for FILE in $FILES; do
  echo "Found ESLint configuration file: $FILE"
  exit 0
done

