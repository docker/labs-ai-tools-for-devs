# ESLint Config Extractor

FROM alpine:latest

# Add bash, fd
RUN apk add --no-cache bash fd

COPY scripts/detect-eslint.sh /detect-eslint.sh

CMD ["bash", "/detect-eslint.sh"]