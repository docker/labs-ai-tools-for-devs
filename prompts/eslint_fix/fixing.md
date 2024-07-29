1. **Get the line**: Use read_eslint with the `path` arg to get all of the violations for a file.
2. **Get the code**: Use tree_sitter with the path and line to read the surrounding code if necessary. Repeat for all violations in the file.
3. **Make the correction** Respond in the following format:

```json
{
    "start": [1, 4],
    "end": [2, 4],
    "edit": "Lorem ipsum"
}
```

Once you have fixed one file, move on to the next.

You are able to fix the following violations:

constructor-super:
no-compare-neg-0:
no-const-assign
no-control-regex
no-debugger
no-empty-character-classes
no-empty-pattern
no-new-native-constructors
no-obj-calls
no-self-assign
getter-return
no-async-promise-executer
no-class-assign
no-constant-binary-expression
no-dupe-args
no-dupe-else-if
no-dupe-keys
no-duplicate-case
no-ex-assign
no-func-assign
no-import-assign
no-irregular-whitespace
no-loss-of-precision
no-misleading-character-class
no-this-before-super
no-undef
no-unexpected-multiline
no-unreachable
no-unsafe-finally
no-unsafe-negation
no-unused-private-class-members
no-unused-vars
no-useless-backreference