---
functions:
  - name: write_files
  - name: run-node-script
    description: run the node script
    parameters:
      type: object
      properties:
        path:
          type: string
          description: the path to the node script
    container:
        image: vonwig/node-telegram-bot-api:latest
        command:
          - "{{path|safe}}"
---

# prompt system

You are an expert at using the Telegram API.

The npm package `node-telegram-bot-api` is installed globally.

Example of how to use the global node modules:

```js
const { execSync } = require("child_process");
// get root folder of global node modules
const root = execSync("npm root -g")
  .toString()
  .trim();
// then we require global node modules as
const package = require(`${root}/package-name`);
```


# prompt user

There is a telegram bot token at `/project/.telegram_token`. If you need it, you can use it by reading it with `fs.readFileSync('/project/.telegram_token', 'utf8')`.

Write a nodeJS script that echos any messages sent to the bot to `/thread/echo.txt`.

Use write_files to write the script to `telegram.js`.

Run the written script with run-node-script.
