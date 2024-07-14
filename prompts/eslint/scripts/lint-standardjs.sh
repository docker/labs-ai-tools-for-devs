#!/bin/bash

PROJECT_DIR="/project"

echo "ARGS:"

# First arg
ARGS="$1"

echo $ARGS

# First arg is json {typescript: boolean, fix: boolean, files: string[]}
TYPESCRIPT=$(echo $ARGS | jq -r '.typescript')

# Get boolean value of fix
FIX=$(echo $ARGS | jq -r '.fix')

# If files key is not present, just use .

if [ $(echo $ARGS | jq -r '.files') == 'null' ]; then
	FILES="."
else
	FILES=$(echo $ARGS | jq -r '.files[]')
fi

echo "Running eslint with typescript: $TYPESCRIPT, fix: $FIX, files: $FILES"

# If typescript is false, run standard
if [ $TYPESCRIPT == 'false' ]; then
	# Pass files array as args to standard
	standard $FILES
	exit $?
fi

TS_FILES=$(echo $FILES | grep -E "\.ts$|\.tsx$")

#Make sure all $TS_FILES start with $PROJECT_DIR, or add it
for TS_FILE in $TS_FILES; do
	if [[ ! $TS_FILE == $PROJECT_DIR* ]]; then
		# Escape / in filenames
		TS_FILE_ESCAPED=$(echo $TS_FILE | sed 's/\//\\\//g')
		PROJECT_DIR_ESCAPED=$(echo $PROJECT_DIR | sed 's/\//\\\//g')
		TS_FILES=$(echo $TS_FILES | sed -e "s/$TS_FILE_ESCAPED/$PROJECT_DIR_ESCAPED\/$TS_FILE_ESCAPED/g")
	fi
done

TS_ROOTS=$(fd -d 3 tsconfig.json)

# If no node roots found
if [ -z "$TS_ROOTS" ]; then
    echo "No Typescript configs found in project"
	exit 0
fi

TS_OUTPUT=""
EXIT_CODE=0

# Run ts-standard in each node root
for TS_ROOT in $TS_ROOTS; do
	TS_ROOT="$PROJECT_DIR/$TS_ROOT"
	root_dirname=$(dirname $TS_ROOT)
	cd $root_dirname
	# Filter all TS_FILES in root_dirname
	TS_FILES_IN_ROOT=$(echo $TS_FILES | grep $root_dirname)
	
	# If no TS_FILES in root_dirname, skip
	if [ -z "$TS_FILES_IN_ROOT" ]; then
		continue
	fi
	# If FIX
	if [ $FIX == True ]; then
		LINT_ARGS="--fix $TS_FILES_IN_ROOT"
	else
		LINT_ARGS="$TS_FILES_IN_ROOT"
	fi

	TS_OUTPUT+=$(ts-standard $LINT_ARGS)
	# If ts-standard failed and EXIT_CODE is 0, set EXIT_CODE
	if [ $? -ne 0 ] && [ $EXIT_CODE -eq 0 ]; then
		EXIT_CODE=$?
	fi
done

echo $TS_OUTPUT
exit $EXIT_CODE
