# DDUI Extension

A Docker Desktop extension to run prompts.

https://github.com/docker/labs-ai-tools-for-devs

## Usage

Install the extension from https://hub.docker.com/extensions/docker/labs-ai-tools-for-devs.

Enter your OpenAI key into the extension.

Add a project by selecting a directory.

Add a prompt by either pasting a git url/ref or selecting a local directory.

Make sure both your prompt and project are selected and then click "Run".

## Development

You can use `docker` to build, install and push your extension. Also, we provide an opinionated [Makefile](Makefile) that could be convenient for you. There isn't a strong preference of using one over the other, so just use the one you're most comfortable with.

To build the extension, use `make build-extension` **or**:

```shell
  docker buildx build -t docker/labs-ai-tools-for-devs:local . --load
```

To install the extension, use `make install-extension` **or**:

```shell
  docker extension install docker/labs-ai-tools-for-devs:local
```

> If you want to automate this command, use the `-f` or `--force` flag to accept the warning message.

To preview the extension in Docker Desktop, open Docker Dashboard once the installation is complete. The left-hand menu displays a new tab with the name of your extension. You can also use `docker extension ls` to see that the extension has been installed successfully.

### Frontend development

During the development of the frontend part, it's helpful to use hot reloading to test your changes without rebuilding your entire extension. To do this, you can configure Docker Desktop to load your UI from a development server.
Assuming your app runs on the default port, start your UI app and then run:

```shell
  cd ui
  npm install
  npm run dev
```

This starts a development server that listens on port `3000`.

You can now tell Docker Desktop to use this as the frontend source. In another terminal run:

```shell
  docker extension dev ui-source vonwig/labs-ai-tools-for-devs:local http://localhost:3000
```

In order to open the Chrome Dev Tools for your extension when you click on the extension tab, run:

```shell
  docker extension dev debug docker/labs-ai-tools-for-devs:local
```

Each subsequent click on the extension tab will also open Chrome Dev Tools. To stop this behaviour, run:

```shell
  docker extension dev reset docker/labs-ai-tools-for-devs:local
```

### Backend development (optional)

This example defines an API in Go that is deployed as a backend container when the extension is installed. This backend could be implemented in any language, as it runs inside a container. The extension frameworks provides connectivity from the extension UI to a socket that the backend has to connect to on the server side.

Note that an extension doesn't necessarily need a backend container, but in this example we include one for teaching purposes.

Whenever you make changes in the [backend](./backend) source code, you will need to compile them and re-deploy a new version of your backend container.
Use the `docker extension update` command to remove and re-install the extension automatically:

```shell
docker extension update docker/labs-ai-tools-for-devs:local
```

> If you want to automate this command, use the `-f` or `--force` flag to accept the warning message.

> Extension containers are hidden from the Docker Dashboard by default. You can change this in Settings > Extensions > Show Docker Extensions system containers.

### Clean up

To remove the extension:

```shell
docker extension rm docker/labs-ai-tools-for-devs:local
```
