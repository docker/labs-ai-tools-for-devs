FROM alpine:3.20

# Get bash, jq, fdfind
RUN apk add --no-cache bash jq fd

VOLUME /project

WORKDIR /

COPY ./scripts/build-node-roots.sh /build-node-roots.sh

# MAke the thing executable
RUN chmod +x build-node-roots.sh

COPY ./scripts/payload.json /payload.json
# when the container is running the project is mounted at /project read-only
ENTRYPOINT ["/build-node-roots.sh"]
