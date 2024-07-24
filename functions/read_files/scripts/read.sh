#!/bin/bash
JSON_ARGS=$1

# Read file paths array
FILE_PATHS=$(echo $JSON_ARGS | jq -r '.files[]')

for FILE_PATH in $FILE_PATHS; do
    echo -e "Content for \`$FILE_PATH\`:\n\n\`\`\`\n"
    # If file doesn't exist
    if [ ! -f $FILE_PATH ]; then
        echo "File $FILE_PATH does not exist"
    else
        # Print file content
        cat $FILE_PATH
    fi
    echo -e "\n\`\`\`\n\n"
done
