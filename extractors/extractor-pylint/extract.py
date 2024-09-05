import json
from pylint.lint import Run
from io import StringIO
import sys
import subprocess
import os

def run_codescope(file_path, start_line, end_line):
    # Example call to CodeScope to analyze the specific file and lines
    # Replace this command with the actual one you use to run CodeScope
    result = subprocess.run(
        ["codescope", "--file", file_path, "--start-line", str(start_line), "--end-line", str(end_line)],
        capture_output=True, text=True
    )

    # Print the output for debugging
    print(f"CodeScope output:\n{result.stdout}")

    if not result.stdout.strip():
        print("Error: CodeScope returned an empty response.")
        return {}

    try:
        return json.loads(result.stdout)  # Assuming CodeScope returns JSON
    except json.JSONDecodeError as e:
        print(f"JSON decoding failed: {e}")
        return {}
    
def extract_code_block(file_path, start_line):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    # Find the start of the code block (e.g., a function or class)
    block_start = start_line - 1
    while block_start > 0:
        if lines[block_start].strip().startswith(('def ', 'class ')):
            break
        block_start -= 1

    # Determine the block's indentation level
    indent_level = len(lines[block_start]) - len(lines[block_start].lstrip())

    # Collect lines until the indentation level decreases (end of the block)
    block_end = block_start
    while block_end < len(lines):
        line_indent = len(lines[block_end]) - len(lines[block_end].lstrip())
        if line_indent < indent_level and lines[block_end].strip():
            break
        block_end += 1

    return ''.join(lines[block_start:block_end])

def main():
    # Set up Pylint to capture its output
    old_stdout = sys.stdout
    pylint_output = StringIO()
    sys.stdout = pylint_output

    # Run Pylint on the current directory
    Run([".", "--recursive=y", "--output-format=json"], exit=False)
    linter_output = pylint_output.getvalue()
    sys.stdout.close()
    sys.stdout = old_stdout

    # Parse the Pylint output
    pylint_issues = json.loads(linter_output)

    # Loop through each issue and extract the relevant code block
    for issue in pylint_issues:
        file_path = issue['path']
        start_line = issue['line']
        end_line = issue.get('endLine', start_line)

        # Attempt to extract the code block manually
        code_section = extract_code_block(file_path, start_line)

        # Create a payload with the extracted code and Pylint output
        payload = {
            "pylint": {
                "code": code_section,
                "linter_output": linter_output
            }
        }

        json_payload = json.dumps(payload)

        # Print or return the payload
        print(json_payload)

if __name__ == '__main__':
    main()