#!/bin/bash

echo "GOT ARGS $1"

ARGS_JSON=$1

# Get the arguments
COMMAND=$(echo $ARGS_JSON | jq -r '.command')

ARGS=$(echo $ARGS_JSON | jq -r '.args')

# Run the command

git $COMMAND $ARGS