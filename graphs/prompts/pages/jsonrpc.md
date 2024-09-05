### Notification Methods
- #### message
  
  This is a message from the assitant role, or from a tool role. 
  The params for the `message` method should be appended to the conversation.  The `params` can be either 
  `content` or `debug`.
  
  ```json
  {"params": {"content": "append this output to the current message"}}
  {"params": {"debug": "this is a debug message and should only be shown in debug mode"}}
  ```
- #### prompts
  
  Generated user and system prompts are sent to the client so that they can be displayed.  These
  are sent after extractors are expanded so that users can see the actual prompts sent to the AI model.
  
  ```json
  {"params": {"messages": [{"role": "system", "content": "system prompt message"}]}}
  ```
- #### functions
  
  Functions are json encoded strings.  When streaming, the content of the json params will change as 
  the functions streams.  This can be rendered in place to show the function definition completing
  as it streams.
  
  ```json
  {"params": "{}"}
  ```
- #### functions-done
  
  This notification is sent when a function definition has stopped streaming, and is now being executed.  
  The next notification after this will be a tool message.
  
  ```json
  {"params": ""}
  ```
- #### error
  
  The `error` notification is not a message from the model, prompts, or tools.  Instead, it represents a kind
  of _system_ error trying to run the conversation loop.  It should always be shown to the user as it 
  probably represents something like a networking error or a configuration problem.
  
  ```json
  {"params": {"content": "error message"}}
  ```
- ### Request Methods
- #### prompt
  
  Send a user prompt into the [[conversation loop]].  The `prompt` method takes the following `params`.
  
  ```json
  {"params": {"content": "here is the user prompt"}}
  ```