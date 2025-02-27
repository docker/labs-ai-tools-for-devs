---
title: defining container tools
---

* default is to run synchronously without stdin and in terminal model
* image is mandatory
    * default is to try to pull image every time it runs 
* always binds docker-lsp volume (does not bind prompts volume - that's only for the server)
* if server is running with a host-dir, that host-dir will bind with /volume
* there will pretty much always be a mounted /thread volume but see below
* volumes is also an optional parameter in the container definition
* workingdir (parameter is called workdir) is either set in the definition or defaults to /project
* /var/run/docker.sock is always mounted

# parameters

* volumes (list of strings)    supports interpolation         optional
* entrypoint (list of strings) supports interpolation         optional
* command (list of strings)    supports interpolation         optional
* workdir (string)             supports interpolation         optional
* stdin (keys content, file)   supports interpolation         optional

* environment (map)            does NOT support interpolation  optional
* image (string)               does not support interpolation  mandatory

# interpolation

* has a filter called `|into` that will take a parameter list and _spread_ it into a string list
* `volumes` `command` `workdir` `stdin.content` and `stdin.file` all support interpoloation
* `image` and `entrypoint` do not support interpolation

