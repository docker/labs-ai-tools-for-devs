# Function

In the functions section include the following definition:

```yaml
functions:
  - name: write_files
    description: Write a set of files to my project
    parameters:
        type: object
        properties:
          files:
            type: array
            items:
              type: object
              properties:
                path:
                  type: string
                  description: the relative path to the file that should be written
                content:
                  type: string
                  description: the content that should be written to a file
                executable:
                  type: boolean
                  description: whether to make the file executable
    container:
        image: vonwig/function_write_files:latest
```

The container above will run with a `rw` mount which gives it access
to the root of the project.

* the `path` parameter is a relative path from the project root
* the content is intended to replace what is already in the file
* the executable flag should be used to set the executable bit on the file
