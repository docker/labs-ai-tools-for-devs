#!/bin/bash

INPUT=$(cat)
FORMAT=$1

if [ "$FORMAT" == "json" ]; then
    echo "$INPUT"
    exit 0
fi

MESSAGES=$(echo "$INPUT" | jq -r -c '.[]')

if [ "$FORMAT" == "summary" ]; then

    TOTAL_MESSAGES=$(echo "$MESSAGES" | wc -l)

    TOTAL_AFFECTED_FILES=$(echo $INPUT | jq -r '.[].path' | sort | uniq | wc -l)
    echo "Ran pylint and found $TOTAL_MESSAGES messages across $TOTAL_AFFECTED_FILES files."
    exit
fi

for MESSAGE in $MESSAGES; do
    MESSAGE_TYPE=$(echo "$MESSAGE" | jq -r '.type')
    MESSAGE_LINE=$(echo "$MESSAGE" | jq -r '.line')
    MESSAGE_COLUMN=$(echo "$MESSAGE" | jq -r '.column')
    MESSAGE_PATH=$(echo "$MESSAGE" | jq -r '.path')
    MESSAGE_FILE=$(echo "$MESSAGE" | jq -r '.file')
    MESSAGE_SYMBOL=$(echo "$MESSAGE" | jq -r '.symbol')
    MESSAGE_MESSAGE=$(echo "$MESSAGE" | jq -r '.message')
    # If condensed
    if [ "$FORMAT" == "condensed" ]; then
        echo "$MESSAGE_TYPE: $MESSAGE_CODE"
        continue
    fi
done