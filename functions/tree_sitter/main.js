const TreeSitter = require('tree-sitter');
const Python = require('tree-sitter-python');
const fs = require('fs');

const args = JSON.parse(process.argv[2])

// Load the Python parser
const parser = new TreeSitter();
// Set the language to the parser
parser.setLanguage(Python);
// Read the code file content
const codeContent = fs.readFileSync(args.path, 'utf8');
// Parse the code using the chosen parser
const parsed = parser.parse(codeContent);

const line_to_grab = args.line

// Look for node where node.startPosition.row and node.endPosition.row are equal to line_to_grab
const search_node = (node) => {
    if (node.startPosition.row === line_to_grab && node.endPosition.row === line_to_grab) {
        return node
    }
    for (const child of node.children) {
        const result = search_node(child)
        if (result) {
            return result
        }
    }
    return null
}

const line_node = search_node(parsed.rootNode)

const parent = line_node.parent

console.log({
    offending_line: line_node.text,
    line_node: line_node,
    parent: parent,
    parent_text: parent.text
})