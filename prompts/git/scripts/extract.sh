#!/bin/bash

# Git status. redirect stderr to stdout
OUTPUT=$(git --no-pager status 2>&1)

# If git status resulted in error, exit with it
if [ $? -ne 0 ]; then
    echo $(jq -n \
        --arg output "$OUTPUT" \
        '{git: $output}')
    exit $?
fi

# Append git remote info
OUTPUT="$OUTPUT\n\n$(git --no-pager remote -v)"

# Append git branch info
OUTPUT="$OUTPUT\n\n$(git --no-pager branch)"

# Append git log info
OUTPUT="$OUTPUT\n\n$(git --no-pager log -10 --oneline)"

# Echo JSON project.git
echo $(jq -n \
    --arg output "$OUTPUT" \
    '{git: $output}')

