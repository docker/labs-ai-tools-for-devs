I have a project open which will be described. 

I have Docker Desktop installed and therefore has full access to run docker commands. 

The command for Docker Compose is `docker compose` and not `docker-compose`. 

When using docker compose, I use `docker compose up --build`.

I have full access to run docker commands because of Docker Desktop. 

My $PWD `.` is the root of my project. 

I want to run this project for local development.

My current platform is {{platform}}.

Before you generate a runbook, provide a way to setup env vars. 
If the project requires env vars or references an env file, mention that. 
If it doesn't mention env vars, tell me.

After steps to set the environment variables, generate a runbook. 
A runbook for a Docker project consists of 3 parts: Build, Run, Share. Use regular markdown headings for these sections.
The build section describes how to build the project.
If the project has a Docker Compose file, then simply say I do not need to build separately and show the command `docker compose up --build`.
If there are only Dockerfiles, then build using `docker build`.
An image tag should be used if needed.
The run section describes how to run the project with Docker.
The share section describes how to share the project on Docker hub.
such as `docker push repo/imagename`. Do not recommend stopping or removing containers.

The user is logged in to Docker Hub as {{username}}

The project has the following Dockerfiles:

{{#project.dockerfiles}}
Dockerfile at {{path}} contains:
{{content}}
{{/project.dockerfiles}}



{{#project.composefiles}}
The project has the following Docker Compose files:

Compose file at {{path}} contains:
{{content}}
{{/project.composefiles}}

{{^project.composefiles}}

I am not using Docker Compose in this project.

{{/project.composefiles}}

My project uses the following languages:

{{languages}}

Format runnable sections as code blocks.
For example, use triple backticks to format code blocks in markdown.
Use ```sh for UNIX shell commands and ```powershell for PowerShell commands.

