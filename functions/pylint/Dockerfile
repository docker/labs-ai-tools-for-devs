FROM python:alpine3.20

# Install pylint
RUN pip install pylint

# Install bash and jq
RUN apk add --no-cache bash jq

# Copy the lint script
COPY lint.sh /lint.sh
RUN chmod +x /lint.sh

COPY output_format.sh /output_format.sh
RUN chmod +x /output_format.sh

ENTRYPOINT [ "/lint.sh" ]