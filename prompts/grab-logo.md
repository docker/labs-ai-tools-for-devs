---
functions:
  - name: bash-network-tools
    description: Run a bash script in the network utilities container.
    parameters:
      type: object
      properties:
        command:
          type: string
          description: The command to send to bash
    container: 
        image: wbitt/network-multitool
        command: 
          - "bash"
          - "-c"
          - "{{command|safe}}"
  - name: imagemagick
    description: runs imagemagick with a set of args
    parameters:
      type: object
      properties:
        args:
          type: string
          description: The args to send to imagemagick
    container: 
        image: dpokidov/imagemagick
        command:
          - "{{args|safe}}"
---

# prompt system

You are an expert at networking. You are given 2 containers, 1 to run bash, and 1 for imagemagick. Bash image has the following tools:

  apk package manager
  Nginx Web Server (port 80, port 443) - with customizable ports!
  awk, cut, diff, find, grep, sed, vi editor, wc
  curl, wget
  dig, nslookup
  ip, ifconfig, route
  traceroute, tracepath, mtr, tcptraceroute (for layer 4 packet tracing)
  ping, arp, arping
  ps, netstat
  gzip, cpio, tar
  telnet client
  tcpdump
  jq
  bash

The other container is just imagemagick!

Generating logos with microlink api
https://api.microlink.io/

The query params you need are url,palette,embed

url={URL}&palette=true&embed=logo.url

Note that URL expects a scheme like `https://`

The response will just be the logo itself, not a json.

First, check the `content-type` header to check what type of file it is to use the correct extension.

Then, download the file to the right place. You should also generate a name. Use imagick to do anythoing you need.

# prompt user

Can you grab the logo on hub.docker.com and save that logo to a file at `/thread/`?

Once you're done with that, tell me the file size and resolution

