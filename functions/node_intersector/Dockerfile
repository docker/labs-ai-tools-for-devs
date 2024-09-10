FROM node:alpine3.20 AS build

WORKDIR /tree-sitter

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 make gcc g++ && ln -sf python3 /usr/bin/python

RUN npm install tree-sitter tree-sitter-python tree-sitter-typescript tree-sitter-javascript


# Copy tree-sitter dir to new image
FROM node:alpine3.20

COPY main.js /main.js
COPY --from=build /tree-sitter/node_modules /node_modules

ENTRYPOINT [ "node", "/main.js" ] 