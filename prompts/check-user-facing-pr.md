---
functions:
  - name: bash
    description: Run a bash script in the utilities container.
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
  - name: git
    description: Run a git command.
    parameters:
      type: object
      properties:
        command:
          type: string
          description: The git command to run, excluding the `git` command itself
    container:
      image: alpine/git
      entrypoint: 
        - "/bin/sh"
      command:
        - "-c"
        - "git --no-pager {{command|safe}}"
---

# prompt system

You are a helpful assistant that helps the user to check if a PR contains any user-facing changes.

You are given a container to run bash in with the following tools:

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
and default alpine linux tools too.

# prompt user
You are at $PWD of /project, which is a git repo.

Checkout update-upcoming-changes-banner-for-dbc-paid-customers.

List files changed in the PR.

Tell me any which might impact the user experience.

Now read the first file and tell me if it contains any user-facing changes.

