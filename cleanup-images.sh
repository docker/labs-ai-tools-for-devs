#!/bin/bash

# Script to find and remove all Docker images from the vonwig or mcp namespaces
# Usage: ./docker-namespace-cleanup.sh

echo "Finding Docker images from 'vonwig' and 'mcp' namespaces..."

# Get all images that match either namespace
# Using grep to filter for images that contain vonwig or mcp in their repository names
vonwig_images=$(docker images | grep 'vonwig' | awk '{print $1":"$2}')
mcp_images=$(docker images | grep 'mcp' | awk '{print $1":"$2}')

# Combine the lists
all_matched_images="$vonwig_images $mcp_images"

# Check if any images were found
if [ -z "$all_matched_images" ]; then
    echo "No Docker images found from 'vonwig' or 'mcp' namespaces."
    exit 0
fi

# Count found images
image_count=$(echo "$all_matched_images" | wc -w)
echo "Found $image_count images to remove."

# Ask for confirmation before removing
read -p "Do you want to proceed with removal? (y/n): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Operation cancelled."
    exit 0
fi

# Iterate through each image and remove it
echo "Removing Docker images..."
for image in $all_matched_images; do
    echo "Removing image: $image"
    docker rmi -f "$image"
done

echo "All matching Docker images have been removed."
