FROM node:lts-alpine3.20

# Add bash, fd
RUN apk add --no-cache bash fd

COPY lint.sh /lint.sh
# Install standard and ts-standard
RUN npm install -g standard ts-standard

CMD [ "bash", "/lint.sh" ]