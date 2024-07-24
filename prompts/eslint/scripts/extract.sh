#!/bin/bash

OUTPUT=""

# Detect ESLint eslintrc or eslint.config
ESLINTRC_PATTERN=".eslintrc*"

ESLINTCONFIG_PATTERN="eslint.config.*"

FILES=()
FILES+=$(fd --hidden -g $ESLINTRC_PATTERN .)
FILES+="$(fd -g $ESLINTCONFIG_PATTERN .)"

# Search for any tsconfig.json
TS_CONFIGS=$(fd -g tsconfig.json .)
for TS_CONFIG in $TS_CONFIGS; do
  OUTPUT+="Found Typescript configuration file: $TS_CONFIG\n"
done

if [ -z "$TS_CONFIGS" ]; then
  OUTPUT+="No Typescript configuration files found in project.\n"
fi

for FILE in $FILES; do
  OUTPUT+="Found ESLint configuration file: $FILE\n"
done

# If no files found or empty, just exit with 0
if [ -z "$FILES" ]; then
  OUTPUT+="No ESLint configuration files found in project.\n"
  echo -e "{\"project\": {\"eslint\": \"$OUTPUT\"}}"
  exit 0
fi

# Search for any package.json containing eslint
FILES=$(fd -g package.json .)
for FILE in $FILES; do
  if grep -q '"eslint":' $FILE; then
    # Report version of eslint
    ESLINT_VERSION=$(jq -r '.devDependencies.eslint' $FILE)
    OUTPUT+="Found ESLint in $FILE: $ESLINT_VERSION\n"
  fi
done



# Echo output as json nested key "project.eslint"
echo -e "{\"project\": {\"eslint\": \"$OUTPUT\"}}"

