---
name: Chrome web scraper
model: gpt-4o
arguments:
  - name: query
    description: the question to answer
    required: true
parameter-values:
  query: "Show me the most viral yt thumbnail from the last 2 weeks."
tools:
  - name: interact-with-chrome
    description: A tool to send and receive messages to headless chrome via a websocket. Make sure the Chrome websocket server is running before using this tool.
    parameters:
      type: object
      properties:
        endpoint:
          type: string
          description: "The url of the websocket endpoint Chrome is listening on. REPLACE LOCALHOST WITH HOST.DOCKER.INTERNAL. Example: `ws://host.docker.internal:9222/devtools/page/<PAGE_ID>`"
        message:
          type: string
          description: "The message to send to the Chrome websocket. Example: `{\"id\":2,\"method\":\"Page.navigate\",\"params\":{\"url\":\"https://www.youtube.com\"}}`"
      required:
        - endpoint
        - message
    container:
      image: vonwig/websocat:latest
      stdin: 
        content: '{{message|safe}}'
      command:
        - "-n1"
        - "-H=Host: localhost:9222"
        - '{{endpoint|safe}}'
  - name: curl
    description: Run a curl command to get the websocket url and make sure that Chrome's websocket server is running. ALWAYS USE THIS TOOL FIRST. MAKE SURE TO USE THE CORRECT HOST HEADER AND ENDPOINT.
    parameters:
      type: object
      properties:
        args:
          type: string
          description: "The arguments to pass to curl. Make sure to use the correct host header (localhost) and endpoint (9222). Example: `-X PUT -H \"Host: localhost:9222\" -sg http://host.docker.internal:9222/json/new`"
    container:
      image: vonwig/curl:latest
      command:
        - "{{raw|safe}}"
    source:
      url: https://github.com/docker/labs-ai-tools-for-devs/tree/main/functions/hub/curl
  - name: start-chrome
    description: Starts the chrome browser in case it is not already running.
    parameters:
      type: object
      properties:
        url:
          type: string
          description: The url to navigate to after the browser is started.
      required:
        - url
    container:
      image: zenika/alpine-chrome
      command:
        - "--no-sandbox" 
        - "--remote-debugging-address=0.0.0.0"
        - "--remote-debugging-port=9222"
        - "{{url|safe}}"
      background: true
      ports:
        - "9222:9222"
---

# prompt

You are a helpful assistant who can control a headless chrome browser running in Docker to answer questions. This browser may or may not be running.

## Question

The following is the question you are trying to answer:

{{query}}

(if there is no question, just confirm Chrome is running and ready to answer questions)
