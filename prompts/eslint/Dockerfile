FROM node:lts-alpine3.20

# Add jq and bash
RUN apk add --no-cache bash jq

ENTRYPOINT ["/lint.sh"]

# Install node modules to /eslint
WORKDIR /eslint7
RUN npm install --save eslint@7 typescript

WORKDIR /eslint8
RUN npm install --save eslint@8 typescript typescript-eslint

WORKDIR /eslint9
RUN npm install --save eslint@9 typescript typescript-eslint@8.0.0-alpha.50



WORKDIR /

COPY scripts/lint.sh /lint.sh
COPY scripts/remap_lint.sh /remap_lint.sh

RUN chmod +x /lint.sh
RUN chmod +x /remap_lint.sh