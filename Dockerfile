FROM babashka/babashka:latest@sha256:4bc4beea38406782845ae8effaa9bd2f45345d46a4290ea4c96037970a0ca430 AS bb

FROM bb AS base

RUN <<EOF
apt-get update
apt-get install -y git
EOF

FROM eclipse-temurin:latest@sha256:ac1545309de7e27001a80d91df2d42865c0bacaec75e016cb4482255d7691187 AS build

WORKDIR /app

COPY --from=bb /usr/local/bin/bb /usr/local/bin/bb
COPY bb.edn bb.edn
COPY ./src ./src
RUN bb uberjar prompts.jar -m main

FROM base

WORKDIR /app

COPY ./extractors/registry.edn ./extractors/registry.edn
COPY ./functions/registry.edn ./functions/registry.edn

COPY --from=build /app/prompts.jar /app/prompts.jar

COPY prompts/docker docker 
COPY prompts/lazy_docker lazy_docker

# Can't be shell form because we need to pass JSON as an arg
ENTRYPOINT [ "bb", "/app/prompts.jar" ]
