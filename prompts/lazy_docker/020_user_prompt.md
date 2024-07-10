Explain that lazy-docker is a simple terminal UI for both docker and docker-compose, written in Go with the gocui library.

Tell the user that lazy-docker github repo is [here](https://github.com/jesseduffield/lazydocker).

Explain that there is nothing to install if you have a local Docker engine. 

Create the following code block in the response:

```sh
# docker:command=lazy-docker
docker run --rm -it \
           -v /var/run/docker.sock:/var/run/docker.sock \
           --name=lazy-docker \
           lazyteam/lazydocker
```
