#!/bin/bash

# Get piped stdin as input
INPUT=$(cat)

OUTPUT="{}"

OUTPUT_MODE=$1 # summary, complaints, condensed, json

# If not set
if [ -z "$OUTPUT_MODE" ]; then
    OUTPUT_MODE="summary"
fi

FILE_PATHS=$(echo $INPUT | jq -r '.[].filePath')
ALL_MESSAGES=$(echo $INPUT | jq -r -c '.[].messages')

# convert to array
IFS=$'\n' FILE_PATHS=($FILE_PATHS)
IFS=$'\n' ALL_MESSAGES=($ALL_MESSAGES)
echo "Peparing output"
AFFECTED_FILE_COUNT=$(echo $INPUT | jq -r 'length')
# Iterate over file paths
for index in "${!FILE_PATHS[@]}"; do
    file_path=${FILE_PATHS[$index]}
    # Get the messages for the file path
    messages=${ALL_MESSAGES[$index]}

    if [ $OUTPUT_MODE == "complaints" ]; then
        echo "complaints"
        # Complaint: {filePath: "path", "start": [line, column], "end": [line, column], "message": "message", "severity": "severity", "ruleId": "ruleId"}
        messages=$(echo $messages | jq -r -c '.[]')
        IFS=$'\n' messages=($messages)
        for message in "${messages[@]}"; do
            # If endLine is null, set it to line
            message_parsed=$(echo $message | jq -r -c 'if .endLine == null then .endLine = .line end')
            # If endColumn is null, set it to convert column to number and add 1
            message_parsed=$(echo $message_parsed | jq -r -c 'if .endColumn == null then .endColumn = (.column | tonumber + 1) end')
            # If severity is null, set it to "error"
            message_parsed=$(echo $message_parsed | jq -r -c 'if .severity == null then .severity = "error" end')
            COMPLAINT=$(echo $message_parsed | jq -r -c --arg file_path $file_path '{filePath: $file_path, start: [.line, .column], end: [.endLine, .endColumn], message: .message, severity: .severity, ruleId: .ruleId}')
            echo $COMPLAINT
        done
    elif [ $OUTPUT_MODE == "condensed" ]; then
        echo "condensed"
        # Remove duplicates
        messages=$(echo $messages | jq -r -c 'unique_by(.ruleId)')
        messages=$(echo $messages | jq -r -c '.[]')
        IFS=$'\n' messages=($messages)
        # Iterate over messages
        for message in "${messages[@]}"; do
            # Get the message id
            ID=$(echo $message | jq -r '.ruleId')
            
            # If the OUTPUT[id] is null, set it to empty array
            if [[  $(echo $VIOLATIONS_BY_ID | jq -r "has(\"$ID\")") == 'false' ]]; then
                OUTPUT=$(echo $OUTPUT | jq --arg id "$ID" '.[$id] = []')
            fi
            # Add the fileid to the violations object key
            OUTPUT=$(echo $OUTPUT | jq --arg id "$ID" --arg file_path "$file_path" '.[$id] += [$file_path]')
        done
    elif [ $OUTPUT_MODE == "json" ]; then
        OUTPUT=$(echo $INPUT)
        break
    else
        # Summary   
        AFFECTED_FILE_COUNT=$(echo $INPUT | jq -r 'length')
        TOTAL_VIOLATION_COUNT=$(echo $INPUT | jq -r '.[].messages | length' | jq -s add)

        if [[ $TOTAL_VIOLATION_COUNT -gt 0 ]]; then
            OUTPUT="Found $TOTAL_VIOLATION_COUNT violations in $AFFECTED_FILE_COUNT files."
        else
            OUTPUT="No violations found."
        fi
        break
    fi
done

echo $OUTPUT

exit 0