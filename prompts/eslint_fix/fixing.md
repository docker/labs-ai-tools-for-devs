1. **Get the line**: Use read_eslint with the `path` arg to get all of the violations for a file.
2. **Make the correction**: Respond with an edit in JSON format:

```json
{
    "start": [1, 4], // row,col for start character
    "end": [2, 4], // row,col for end character
    "edit": "Lorem ipsum" // The edit to make
}
```