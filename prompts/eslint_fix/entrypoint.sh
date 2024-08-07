#!/bin/bash

ARGS_JSON=$1

THREAD_DIR="/thread"

# Check for eslint.json
if [ ! -f $THREAD_DIR/eslint.json ]; then
    echo "No eslint.json found. Exiting."
    exit 0
fi

# Get eslint.json
ESLINT_JSON=$(cat $THREAD_DIR/eslint.json)

# Replace all eslint-temp with empty string
ESLINT_JSON=$(echo $ESLINT_JSON | sed 's/\/eslint-temp\///g')

OUTPUT_LEVEL=$(echo $ARGS_JSON | jq -r '.outputLevel')
FILEPATH=$(echo $ARGS_JSON | jq -r '.path')
# If path is not null
if [ "$FILEPATH" != "null" ]; then
    echo "Getting eslint.json for path: $FILEPATH"
    ESLINT_JSON_FOR_PATH=$(echo $ESLINT_JSON | jq -r --arg path "$FILEPATH" '.[] | select(.filePath == $path)')
    echo "ESLint violations for $FILEPATH:"
    # Strip source key if it exists
    ESLINT_JSON_FOR_PATH=$(echo $ESLINT_JSON_FOR_PATH | jq -r 'del(.source)')
    echo $ESLINT_JSON_FOR_PATH
    exit 0
fi

echo $ESLINT_JSON | /remap_lint.sh "$OUTPUT_LEVEL"
