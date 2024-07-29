#!/bin/bash

PROJECT_DIR="/project"

THREAD_DIR="/thread"

# First arg
ARGS="$1"

# First arg is json {typescript: boolean, fix: boolean, files: string[]}
TYPESCRIPT=$(echo $ARGS | jq -r '.typescript')

# Get boolean value of fix
FIX=$(echo $ARGS | jq -r '.fix')

# How verbose to output the linting results
OUTPUT_LEVEL=$(echo $ARGS | jq -r '.outputLevel')

# If files key is not present, just use glob

if [ $(echo $ARGS | jq -r '.files') == 'null' ]; then
	# Glob for js, ts, tsx, jsx files
	FILES=$(fd -e js -e ts -e tsx -e jsx)
else
	FILES=$(echo $ARGS | jq -r '.files[]')
fi

# If typescript is false, run standard
if [ $TYPESCRIPT == 'false' ]; then
	LINT_ARGS="$FILES"
	# If FIX
	if [ $FIX == "true" ]; then
		LINT_ARGS="--fix $FILES"
	fi
	# Pass files array as args to standard
	STANDARD_JSON=$(standard 2>/dev/null | standard-json)
	echo $STANDARD_JSON | /remap_lint.sh "$OUTPUT_LEVEL"
	echo $STANDARD_JSON > $THREAD_DIR/eslint.json
	exit $?
fi

TS_FILES=$(echo "$FILES" | grep -E "\.ts$|\.tsx$")

TS_ROOTS=$(fd -d 3 tsconfig.json)

# If no node roots found
if [ -z "$TS_ROOTS" ]; then
    echo "No Typescript configs found in project. Exiting."
	exit 0
fi

TS_OUTPUT=""
EXIT_CODE=0

PROJECT_DIR=$(pwd)

# Run ts-standard in each node root
for TS_ROOT in $TS_ROOTS; do
	root_dirname=$(dirname $TS_ROOT)
	cd $root_dirname
	# Filter all TS_FILES in root_dirname
	TS_FILES_IN_ROOT=$(echo "$TS_FILES" | grep -E $root_dirname)
	# If no TS_FILES in root_dirname, skip
	if [ -z "$TS_FILES_IN_ROOT" ]; then
		continue
	fi
	# If FIX
	if [ $FIX == "true" ]; then
		LINT_ARGS="--fix $TS_FILES_IN_ROOT"
	else
		LINT_ARGS="$TS_FILES_IN_ROOT"
	fi
	TS_JSON=$(ts-standard 2>/dev/null | standard-json)
	echo $TS_JSON >> $THREAD_DIR/eslint.json
	TS_OUTPUT+=$($TS_JSON | /remap_lint.sh "$OUTPUT_LEVEL")
	# If ts-standard failed and EXIT_CODE is 0, set EXIT_CODE
	if [ $? -ne 0 ] && [ $EXIT_CODE -eq 0 ]; then
		EXIT_CODE=$?
	fi
	cd $PROJECT_DIR
done

echo $TS_OUTPUT

exit $EXIT_CODE
