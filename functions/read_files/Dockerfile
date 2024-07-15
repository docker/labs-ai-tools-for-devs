FROM alpine:latest

# Add jq and bash
RUN apk add --no-cache bash jq fd

COPY scripts/read.sh /read.sh

RUN chmod +x /read.sh

ENTRYPOINT ["/read.sh"]
