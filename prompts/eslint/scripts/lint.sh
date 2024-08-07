#!/bin/bash


PROJECT_DIR="/project"

THREAD_DIR="/thread"

# First arg
ARGS="$1"

# args[eslint_args] args [eslint_version]

set -f
# Without pathname expansion
ESLINT_ARGS=$(echo $ARGS | jq -r '.args')

ESLINT_VERSION=$(echo $ARGS | jq -r '.version')

ESLINT_DIR="/eslint$ESLINT_VERSION"

TEMP_DIR="/eslint-temp"
mkdir -p $TEMP_DIR

cp -r $PROJECT_DIR/. $TEMP_DIR
cp -r $ESLINT_DIR/. $TEMP_DIR

cd $TEMP_DIR

# How verbose to output the linting results
OUTPUT_LEVEL=$(echo $ARGS | jq -r '.outputLevel')

ARGS="eslint@$ESLINT_VERSION --format json $ESLINT_ARGS"

echo "Running npx with args: $ARGS"

ESLINT_JSON=$(npx --no-install $ARGS )

echo $ESLINT_JSON | /remap_lint.sh "$OUTPUT_LEVEL"
echo $ESLINT_JSON > $THREAD_DIR/eslint.json

# If --fix is in args, copy the files back to the project directory
if [[ $ESLINT_ARGS == *"--fix"* ]]; then
    cp -r $TEMP_DIR/. $PROJECT_DIR
fi

