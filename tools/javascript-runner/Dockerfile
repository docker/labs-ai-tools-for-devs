# The first stage, node dependencies stage - "deps"
FROM node:22-slim@sha256:377674fd5bb6fc2a5a1ec4e0462c4bfd4cee1c51f705bbf4bda0ec2c9a73af72 AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# The second stage - "build"
FROM deps AS build
RUN --mount=type=cache,target=/root/.npm npm ci

# The third stage, selecting a base image recommended by Scout
FROM node:22-slim@sha256:377674fd5bb6fc2a5a1ec4e0462c4bfd4cee1c51f705bbf4bda0ec2c9a73af72
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./main.js ./main.js
ENTRYPOINT ["node", "/app/main.js"]
