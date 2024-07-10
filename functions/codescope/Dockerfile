# syntax = docker/dockerfile:1.4
FROM nixos/nix:latest@sha256:3f6c77ee4d2c82e472e64e6cd7087241dc391421a0b42c22e6849c586d5398d9 AS builder

WORKDIR /tmp/build
RUN mkdir /tmp/nix-store-closure

# ignore SC2046 because the output of nix-store -qR will never have spaces - this is safe here
# hadolint ignore=SC2046
RUN --mount=type=cache,target=/nix,from=nixos/nix:latest@sha256:3f6c77ee4d2c82e472e64e6cd7087241dc391421a0b42c22e6849c586d5398d9,source=/nix \
    --mount=type=cache,target=/root/.cache \
    --mount=type=bind,target=/tmp/build \
    <<EOF
  nix \
    --extra-experimental-features "nix-command flakes" \
    --option filter-syscalls false \
    --show-trace \
    --log-format raw \
    build . --out-link /tmp/output/result
  cp -R $(nix-store -qR /tmp/output/result) /tmp/nix-store-closure
EOF

FROM scratch

WORKDIR /app

COPY --from=builder /tmp/nix-store-closure /nix/store
COPY --from=builder /tmp/output/ /app/

ENTRYPOINT ["/app/result/bin/codescope"]

