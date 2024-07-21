#!/bin/bash

PROJECT_DIR="/project"

# First arg
ARGS="$1"

# args[eslint_args] args [eslint_version]

ESLINT_ARGS=$(echo $ARGS | jq -r '.args')

ESLINT_VERSION=$(echo $ARGS | jq -r '.version')

echo "Linting: eslint@$ESLINT_VERSION $ESLINT_ARGS"

ESLINT_JSON=$(npx --no-install "eslint@$ESLINT_VERSION" --format json "$ESLINT_ARGS")

echo $ESLINT_JSON | /remap_lint.sh