FROM alpine/git:latest

COPY scripts/git.sh /git.sh
COPY scripts/extract.sh /extract.sh

RUN chmod +x /git.sh
RUN chmod +x /extract.sh

ENTRYPOINT ["/git.sh"]