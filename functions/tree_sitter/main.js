const TreeSitter = require('tree-sitter');
const Python = require('tree-sitter-python');
const TypeScript = require('tree-sitter-typescript');
const JavaScript = require('tree-sitter-javascript');
const fs = require('fs');

const args = JSON.parse(process.argv[2])

// Load the Python parser
const parser = new TreeSitter();
// Set the language to the parser
const ext = args.path.split('.').pop();

let language

if (ext === 'py') {
    language = Python
}
else if (ext === 'ts') {
    language = TypeScript.typescript
}
else if (ext === 'tsx') {
    language = TypeScript.tsx
}
else if (ext === 'js' || ext === 'jsx') {
    language = JavaScript
}

parser.setLanguage(language);

// Read the code file content
const codeContent = fs.readFileSync(args.path, 'utf8');
// Parse the code using the chosen parser
const parsed = parser.parse(codeContent);

const line_to_grab = args.line

if (line_to_grab === undefined) {
    console.log('No line number provided')
    process.exit(1)
}

if (line_to_grab > codeContent.split('\n').length) {
    console.log('Line number provided is greater than the number of lines in the file')
    process.exit(1)
}

// Look for node where node.startPosition.row and node.endPosition.row are equal to line_to_grab
const search_node = (node) => {
    if (node.startPosition.row === line_to_grab - 1 && node.endPosition.row === line_to_grab - 1) {
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

if (!line_node) {
    console.log('No node found for line', line_to_grab)
    console.log('Code:', codeContent.split('\n').slice(line_to_grab - 5, line_to_grab + 5).join('\n'))
    process.exit(1)
}

const parseParent = (childNode) => {
    const parent = childNode.parent
    if (!parent) {
        return childNode
    }
    const MIN_CONTEXT_LENGTH = 700
    const MAX_CONTEXT_LENGTH = 1500
    if (parent.text.length > MAX_CONTEXT_LENGTH) {
        console.log('Parent node text is too long, truncating')
        const index = parent.text.indexOf(line_node.text)
        const start = index - MAX_CONTEXT_LENGTH / 2
        const end = index + MAX_CONTEXT_LENGTH / 2
        parent.text = parent.text.slice(start, end)
        return parent
    }
    if (parent.text.length < MIN_CONTEXT_LENGTH) {
        if (parent.parent) {
            return parseParent(parent.parent)
        }
        else {
            return parent
        }
    }
    return parent
}

const ancestor = parseParent(line_node)


const siblings = line_node.parent ? line_node.parent.children : [line_node]

const offending_line = siblings.map(sibling => {
    if (sibling.startPosition.row === line_to_grab - 1 && sibling.endPosition.row === line_to_grab - 1) {
        return sibling.text
    }
}).join('')

console.log({
    offending_line,
    line_node,
    ancestor,
    ancestor_text: ancestor.text
})