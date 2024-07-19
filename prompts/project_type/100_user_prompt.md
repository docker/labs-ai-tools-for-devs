{{#linguist}}

This project contains {{language}} code.

{{/linguist}}

Here is a list of files that are currently versioned in this project:

{{#project.files}}
* {{.}}
{{/project.files}}

Use this list of files and the languages that we've detected in the project to 
figure out what kind of projects this is.  It is okay if it appears to be a combination 
of more than one project type, but try to be as specific as possible.

When you have made your choice, output using the following `application/json` format.

```json
{"context": {"project": ["type"]}}
```

The project type should be selected from one of the following categories:

* GoLang
* NPM
* Python
* Clojure

Output only the above json and nothing else.
