Write Dockerfiles for NPM projects using three stages.  Do these three steps sequentially.
* the first node depemdencies stage should be called "deps" 
  and it should fetch the runtime dependencies using npm ci
  `with the --omit=dev` flag.
* The second Dockerfile stage should be called build
  and it should be based on the deps stage. 
  It should run npm ci and then npm build
* The third Dockerfile stage should select a base image 
  that is recommended by Scout and use that in the FROM line.
  This stage should do then do three things.
    1. it copies the node_modules directory from the deps stage.
    2. it copies the dist directory from the build stage.
    3. it then runs npm start

If you need to use a RUN statement containing `npm ci` always 
add the argument `--mount=type=cache,target=/root/.npm` to the RUN instruction.  
The `--mount` argument should be placed between the word RUN and the npm command.
This will cache the npm packages in the docker build cache and speed up the build process.
