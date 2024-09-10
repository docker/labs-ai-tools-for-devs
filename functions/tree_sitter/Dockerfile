# PYTHON ONLY
FROM rust

RUN cargo install tree-sitter-cli

# Setup parser
COPY config.json /root/.config/tree-sitter/config.json

RUN <<EOF
mkdir -p /root/parsers
cd /root/parsers
git clone https://github.com/tree-sitter/tree-sitter-python
EOF

ENTRYPOINT [ "/bin/bash", "-c"]