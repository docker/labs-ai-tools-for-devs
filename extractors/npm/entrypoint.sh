#!/bin/bash

OUTPUT_JSON="{}"

PACKAGE_JSONS=$(fd -e package.json)

TOTAL_PACKAGE_JSONS=$(echo "$PACKAGE_JSONS" | wc -l)

OUTPUT_JSON=$(echo "$OUTPUT_JSON" | jq -c ".total_package_json_files = $TOTAL_PACKAGE_JSONS")
# If no package.json files are found, exit
if [ "$TOTAL_PACKAGE_JSONS" -eq 0 ]; then
  echo "No package.json files found in the current directory"
  exit 1
fi

# If root level package.json
if [ -f "package.json" ]; then
  OUTPUT_JSON=$(echo "$OUTPUT_JSON" | jq -c ".root_package_json = $(cat package.json)")

fi

# If has node_modules
if [ -d "node_modules" ]; then
  ARG="$(ls node_modules | wc -l) directories"
  OUTPUT_JSON=$(echo "$OUTPUT_JSON" | jq --arg ARG "$ARG" '.node_modules = $ARG')
fi

# If has package-lock.json
if [ -f "package-lock.json" ]; then
  OUTPUT_JSON=$(echo "$OUTPUT_JSON" | jq -c ".package_lock = true")
fi

# If has yarn.lock
if [ -f "yarn.lock" ]; then
  OUTPUT_JSON=$(echo "$OUTPUT_JSON" | jq -c ".yarn_lock = true")
fi

# If has pnpm-lock.yaml
if [ -f "pnpm-lock.yaml" ]; then
  OUTPUT_JSON=$(echo "$OUTPUT_JSON" | jq -c ".pnpm_lock = true")
fi

echo -e "{\"npm\": $OUTPUT_JSON }"