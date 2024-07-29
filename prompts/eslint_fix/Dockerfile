FROM alpine:3.20

RUN apk add --no-cache jq bash

COPY entrypoint.sh /entrypoint.sh

# Depends on eslint prompt sibling directory
COPY scripts/remap_lint.sh /remap_lint.sh 

RUN chmod +x /entrypoint.sh
RUN chmod +x /remap_lint.sh

ENTRYPOINT ["/entrypoint.sh"]