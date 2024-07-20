#!/bin/sh

PROJECT_DIR="/project"

# First arg
ARGS="$1"

# args[eslint_args] args [eslint_version]

ESLINT_ARGS=$(echo $ARGS | jq -r '.args')

ESLINT_VERSION=$(echo $ARGS | jq -r '.version')

echo "Linting: eslint@$ESLINT_VERSION $ESLINT_ARGS"

# Run eslint but suppress the output
npx --no-install "eslint@$ESLINT_VERSION" $ESLINT_ARGS > /dev/null

# If eslint fails, exit with the exit code
if [ $? -ne 0 ]; then
    echo "ESLint exited with an error code: $?"
    exit $?
else 
    echo "ESLint passed with no errors"
    exit 0
fi