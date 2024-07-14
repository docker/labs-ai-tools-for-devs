FROM node:lts-alpine3.20

# Add jq and bash
RUN apk add --no-cache bash jq

ENTRYPOINT ["/lint.sh"]

# Install eslint versions 6-9
RUN npm install -g eslint@6 eslint@7 eslint@8 eslint@9

COPY scripts/lint.sh /lint.sh

RUN chmod +x /lint.sh