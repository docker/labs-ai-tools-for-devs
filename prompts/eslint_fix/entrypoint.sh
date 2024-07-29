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

OUTPUT_LEVEL=$(echo $ARGS_JSON | jq -r '.outputLevel')

echo $ESLINT_JSON | /remap_lint.sh "$OUTPUT_LEVEL"
