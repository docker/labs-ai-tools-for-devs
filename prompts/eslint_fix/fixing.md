1. **Get the line**: Use read_eslint with the `path` arg to get all of the violations for a file.
2. **Get the code**: Use tree_sitter with the path and line to read the surrounding code if necessary. 
3. **Make the correction**: Suggest an edit in the following format:

```json
{
    "start": [1, 4], // row,col for start character
    "end": [2, 4], // row,col for end character
    "edit": "Lorem ipsum" // The edit to make
}
```