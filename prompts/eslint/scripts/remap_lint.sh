# Get piped stdin as input
INPUT=$(cat)

VIOLATIONS_BY_ID="{}"

FILE_PATHS=$(echo $INPUT | jq -r '.[].filePath')
ALL_MESSAGES=$(echo $INPUT | jq -r -c '.[].messages')

# convert to array
IFS=$'\n' FILE_PATHS=($FILE_PATHS)
IFS=$'\n' ALL_MESSAGES=($ALL_MESSAGES)
# Iterate over file paths
for index in "${!FILE_PATHS[@]}"; do
    file_path=${FILE_PATHS[$index]}
    # Get the messages for the file path
    messages=${ALL_MESSAGES[$index]}
    # Remove duplicates
    messages=$(echo $messages | jq -r -c 'unique_by(.ruleId)')
    messages=$(echo $messages | jq -r -c '.[]')
    IFS=$'\n' messages=($messages)
    
    # Iterate over messages
    for message in "${messages[@]}"; do
        # Get the message id
        ID=$(echo $message | jq -r '.ruleId')
        
        # If the violations_by_id[id] is null, set it to empty array
        if [[  $(echo $VIOLATIONS_BY_ID | jq -r "has(\"$ID\")") == 'false' ]]; then
            VIOLATIONS_BY_ID=$(echo $VIOLATIONS_BY_ID | jq --arg id "$ID" '.[$id] = []')
        fi
        # Add the fileid to the violations object key
        VIOLATIONS_BY_ID=$(echo $VIOLATIONS_BY_ID | jq --arg id "$ID" --arg file_path "$file_path" '.[$id] += [$file_path]')
    done
done

echo $VIOLATIONS_BY_ID

exit 0