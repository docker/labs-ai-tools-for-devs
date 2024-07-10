#!/bin/bash
PROJECT_DIR="/project"

cd $PROJECT_DIR

# If --typescript not passed, just run standard
if [ "$1" != "--typescript" ]; then
	standard "${@:1}"
	exit $?
fi

FIX=False

# If --fix is arg after --typescript
if [ "$2" == "--fix" ]; then
	FIX=True
fi

#All args containing a .ts or .tsx file
TS_FILES=$(echo $@ | grep -o '\S*\.ts[x]\?\b')

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
