I have a project open which will be described. 

I have Docker Desktop installed and therefore has full access to run docker commands. 

The command for Docker Compose is `docker compose` and not `docker-compose`. 

When using docker compose, I use `docker compose up --build`.

I have full access to run docker commands because of Docker Desktop. 

My $PWD `.` is the root of my project. 

I want to run this project for local development.

My current platform is {{platform}}.

I'm logged in to Docker Hub as {{username}}

My project has the following Dockerfiles:

{{#project.dockerfiles}}
--- Dockerfile ---
Dockerfile at `./{{path}}` contains:

```dockerfile
{{content}}
```

{{/project.dockerfiles}}

--- Docker Compose Files ---

{{#project.composefiles}}
--- Compose File ---
Compose file at `./{{path}}` contains:

```composefile
{{content}}
```

{{/project.composefiles}}
{{^project.composefiles}}

I am not using Docker Compose in this project.

{{/project.composefiles}}

My project uses the following languages:

{{languages}}

Format runnable sections as code blocks.
For example, use triple backticks to format code blocks in markdown.
Use ```sh for UNIX shell commands and ```powershell for PowerShell commands.

