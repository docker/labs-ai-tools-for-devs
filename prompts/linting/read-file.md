---
tools:
  - name: read-file
---

# prompt user

Read the file `src/app.py` and tell me how many functions you see.

# #prompt user

Read the file `src/app.py` and tell me how many lines are in the file.

# #prompt user does not work!

Read the file `src/app.py` and then output the ranges of lines that each function occupies.
For example, if the function 'foo' is lines 10-2o, then the output should be:

```
{ "foo": [10,20] }
```



