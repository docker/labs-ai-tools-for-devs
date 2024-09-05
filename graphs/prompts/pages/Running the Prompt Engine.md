## Running a prompt pulled from GitHub
title:: Running the Prompt Engine

When running a prompt against a project, the project should be passed to the engine via the `--host-dir` parameter, and the reference to the prompt is passed using the `--prompts` parameter.
Here's an example of how to invoke the prompt engine using `docker run`.

{{embed ((66d779c7-c1b7-40c6-a635-fa712da492de))}}
- ## Running a prompt before it's pushed
  While developing a prompt, you can still invoke the engine on the local prompt.  Instead of using the `--prompts` option, use a `--prompts-file` option and bind mount the directory where the prompt is being developed.
  
  {{embed ((66d77f1b-1684-480d-ad7b-5e9f53292fe4)) }}
- # Running engine as a jsonrpc server
- Add the flag `--jsonrpc` to the list of arguments to switch the stdout stream to be a series of `jsonrpc` notifications.  
  This is useful if you are running the tool and streaming responses on to a canvas.
  Try running the with the `--jsonrpc` to see a full example but the stdout stream will look something like this.
  ```
  {"jsonrpc":"2.0","method":"message","params":{"content":" consistently"}}Content-Length: 65
  {"jsonrpc":"2.0","method":"message","params":{"content":" high"}}Content-Length: 61
  {"jsonrpc":"2.0","method":"message","params":{"content":"."}}Content-Length: 52
  {"jsonrpc":"2.0","method":"functions","params":null}Content-Length: 57
  {"jsonrpc":"2.0","method":"functions-done","params":null}Content-Length: 1703
  ```
  See the [json-rpc documentation]([[jsonrpc]]) for description of the current requests and notifications.