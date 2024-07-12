#/bin/bash

# Detect ESLint eslintrc or eslint.config
ESLINTRC_PATTERN=".eslintrc*"

ESLINTCONFIG_PATTERN="eslint.config.*"

FILES=$(fd --hidden -g $ESLINTRC_PATTERN .)
FILES+=$(fd -g $ESLINTCONFIG_PATTERN .)

for FILE in $FILES; do
  echo "Found ESLint configuration file: $FILE"
done

# If not files found, just exit with 0
if [ -z "$FILES" ]; then
  echo "No ESLint configuration files found"
  exit 0
fi


# Search for any package.json containing eslint
FILES=$(fd -g package.json .)
for FILE in $FILES; do
  if grep -q '"eslint":' $FILE; then
    # Report version of eslint
    ESLINT_VERSION=$(jq -r '.devDependencies.eslint' $FILE)
    echo "$FILE has ESLint dependency: $ESLINT_VERSION"
  fi
done

