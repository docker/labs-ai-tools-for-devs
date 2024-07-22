#!/bin/bash

PROJECT_DIR="/project"

# First arg
ARGS="$1"

# args[eslint_args] args [eslint_version]

ESLINT_ARGS=$(echo $ARGS | jq -r '.args')

ESLINT_VERSION=$(echo $ARGS | jq -r '.version')

# How verbose to output the linting results
OUTPUT_LEVEL=$(echo $ARGS | jq -r '.outputLevel')

echo "Linting: eslint@$ESLINT_VERSION $ESLINT_ARGS"

ESLINT_JSON=$(npx --no-install "eslint@$ESLINT_VERSION" --format json "$ESLINT_ARGS")


if [ $OUTPUT_LEVEL == "0" ]; then
    echo "Linting with ESLint v$ESLINT_VERSION complete."
fi

if [ $OUTPUT_LEVEL == "1" ]; then
    echo "Linting with ESLint v$ESLINT_VERSION complete. Outputting condensed JSON."
    echo $ESLINT_JSON | /remap_lint.sh
fi

if [ $OUTPUT_LEVEL == "2" ]; then
    echo "Linting with ESLint v$ESLINT_VERSION complete. Outputting JSON."
    echo $ESLINT_JSON
fi