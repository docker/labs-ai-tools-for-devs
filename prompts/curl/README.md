---
model: gpt-4
stream: true
functions:
  - name: curl
    description: "Run a curl command."
    parameters:
      type: object
      properties:
        args:
           type: string
           description: "The arguments to pass to curl"
    container:
      image: vonwig/curl:latest
---

# Background

Run curl commands.

* read the contents of `curl --help`
* read tl/dr examples
* read man pages

After ragging the above content, do we know enough about curl to create and run curl examples?

