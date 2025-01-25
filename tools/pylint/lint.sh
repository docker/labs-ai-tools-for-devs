#!/bin/bash

JSON_ARGS=$1

args=$(echo $JSON_ARGS | jq -r '.args')
output_format=$(echo $JSON_ARGS | jq -r '.output_format')

# If no args or args is "null"
if [ -z "$args" ] || [ "$args" == "null" ]; then
    args="."
fi

# If no output_format or output_format is "null"
if [ -z "$output_format" ] || [ "$output_format" == "null" ]; then
    output_format="summary"
fi

pylint --recursive=y --output-format=json $args | /output_format.sh "$output_format"