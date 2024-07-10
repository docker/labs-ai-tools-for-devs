#!/bin/bash

function get_node_version() {
    local DEFAULT_NODE_VERSION=20
    local NODE_VERSION=DEFAULT_NODE_VERSION
    local NODE_VERSION_FILE=null
    local NODE_VERSION_FILE_PATH=null
    local NODE_VERSION_FILE_NAME=null

    if [ -f ".node-version" ]; then
        NODE_VERSION_FILE=".node-version"
    elif [ -f ".nvmrc" ]; then
        NODE_VERSION_FILE=".nvmrc"
    elif [ -f "package.json" ]; then
        NODE_VERSION_FILE="package.json"
    fi

    if [ $NODE_VERSION_FILE == "package.json" ]; then
        NODE_VERSION=$(jq -r '.engines.node' "$NODE_VERSION_FILE")
    else
        NODE_VERSION=$(cat $NODE_VERSION_FILE)
    fi

    NODE_VERSION_FILE_PATH="$(pwd)/$NODE_VERSION_FILE"
    NODE_VERSION_FILE_NAME=$NODE_VERSION_FILE

    if [ $NODE_VERSION == null ]; then
        NODE_VERSION=DEFAULT_NODE_VERSION
        NODE_VERSION_FILE=null
        NODE_VERSION_FILE_PATH=null
    fi

    # Strip non-numeric and non-dot characters
    NODE_VERSION=$(echo $NODE_VERSION | tr -dc '0-9.')

    # Echo json payload
    echo "{\"node_version\": \"$NODE_VERSION\", \"node_version_file\": \"$NODE_VERSION_FILE_NAME\", \"node_version_file_path\": \"$NODE_VERSION_FILE_PATH\"}"
}


PROJECT_DIR="/project"

cd $PROJECT_DIR

# If package.json at root level
if [ -f package.json ]; then
    NODE_ROOTS="package.json"
else
    #TODO if a package.json found contains workspaces, ignore those roots
    NODE_ROOTS=$(fd -d 3 package.json) # newline separated
fi

# If no node roots found
if [ -z "$NODE_ROOTS" ]; then
    echo "{\"project\": {\"node_roots\": []}}"
    exit 0
fi

PAYLOAD_NODE_ROOTS=()

# CD into each node root
for NODE_ROOT in $NODE_ROOTS; do
    NODE_ROOT="$PROJECT_DIR/$NODE_ROOT"
    root_dirname=$(dirname $NODE_ROOT)
    cd $root_dirname
    # Version is json payload
    node_root_version=$(get_node_version | tr -d '\n' | tr -d '\r')

    node_root_path=$root_dirname

    node_root_scripts=$(jq -r '.scripts' package.json)
    # Append json payload
    PAYLOAD_NODE_ROOTS+=("{\"node_root_path\": \"$node_root_path\", \"version\": $node_root_version, \"node_root_scripts\": $node_root_scripts},")
done

# Remove trailing comma from last element
PAYLOAD_NODE_ROOTS[-1]=${PAYLOAD_NODE_ROOTS[-1]%?}

# Echo project.node_roots json payload, comma separated
echo "{\"project\": {\"node_roots\": [${PAYLOAD_NODE_ROOTS[@]}]}}"
