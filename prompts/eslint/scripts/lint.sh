#!/bin/sh

PROJECT_DIR="/project"

echo "ARGS:"

# First arg
ARGS="$1"

# args[eslint_args] args [eslint_version]

ESLINT_ARGS=$(echo $ARGS | jq -r '.args')

ESLINT_VERSION=$(echo $ARGS | jq -r '.version')

npx --no-install "eslint@$ESLINT_VERSION" $ESLINT_ARGS