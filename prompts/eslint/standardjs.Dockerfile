FROM node:lts-alpine3.20

# Add bash, fd
RUN apk add --no-cache bash fd jq

ENTRYPOINT ["/lint-standardjs.sh"]

# Install standard and ts-standard
RUN npm install -g standard ts-standard standard-json

COPY scripts/lint-standardjs.sh /lint-standardjs.sh
COPY scripts/remap_lint.sh /remap_lint.sh

RUN chmod +x /lint-standardjs.sh
RUN chmod +x /remap_lint.sh

