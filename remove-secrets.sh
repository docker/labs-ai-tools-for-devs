#!/bin/bash

# Script to remove all Docker secrets
# Usage: ./docker-secret-cleanup.sh

echo "Retrieving list of Docker secrets..."

# Get the list of secrets (assuming the output format has the secret name as the first column)
secrets=$(docker x secret list | awk 'NR>1 {print $1}')

# Check if any secrets were found
if [ -z "$secrets" ]; then
    echo "No Docker secrets found."
    exit 0
fi

# Iterate through each secret and remove it
echo "Removing Docker secrets..."
for secret in $secrets; do
    echo "Removing secret: $secret"
    docker x secret rm "$secret"
done

echo "All Docker secrets have been removed."
