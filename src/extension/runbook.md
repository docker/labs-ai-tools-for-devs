**Setup Environment Variables**

Before we start running the project, let's set up some environment variables. Since the project requires `DESKTOP_PLUGIN_IMAGE`, make sure to export it as an environment variable.

```shell
export DESKTOP_PLUGIN_IMAGE=<your-image-name>
```

**Runbook**

### Build

Since you're using Docker Compose, you don't need to build separately. Docker Compose will handle the building for you.

### Run

To run the project, navigate to your project directory and use the following command:

```sh
docker compose up --build
```

This command will start the containers and rebuild them if necessary.

### Share

To share the project with others or push it to a registry, you can use the following command:

```shell
docker tag <image-name> docker<image-name>
```

Then, you can push the image to Docker Hub using the following command:

```shell
docker push docker<image-name>
```

That's it! With these commands, you should be able to build, run, and share your project with ease.