Write Dockerfiles using three stages.  Here are the three stages to use:
1. the first stage should be called "deps" 
   and it should fetch the runtime dependencies using npm ci
   `with the --omit=dev` flag.
2. The second stage should be called build
   and it should be based on the deps stage. 
   It should run npm ci first and then it should run npm build
3. The third stage should start with a FROM line that uses the `node` base image. 
   This stage should do then do three things.
     1. it copies the node_modules directory from the deps stage.
     2. it copies the dist directory from the build stage.
     3. it should then create an entrypoint that runs npm start

If you need to use a RUN statement containing `npm ci` always 
add the argument `--mount=type=cache,target=/root/.npm` to the RUN instruction.  
The `--mount` argument should be placed between the word RUN and the npm command.
This will cache the npm packages in the docker build cache and speed up the build process.

* Generate a Dockerfile for an NPM project.
* Call a function to get the recommended tag for repository `node`
* In each FROM line in the Dockerfile, use the recommended tag.
