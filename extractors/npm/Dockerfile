FROM alpine:latest

RUN apk add --no-cache jq bash fd

VOLUME [ "/project" ]

WORKDIR /project

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

