FROM alpine:3.20

# Add jq and bash
RUN apk add --no-cache bash jq fd

ENTRYPOINT ["/extract.sh"]

COPY scripts/extract.sh /extract.sh

RUN chmod +x /extract.sh