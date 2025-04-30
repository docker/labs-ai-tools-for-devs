---
mcp:
  - container:
      image: mcp/aws-kb-retrieval-server:latest
      workdir: /app
      secrets:
        aws.secret_access_key: AWS_SECRET_ACCESS_KEY
      environment:
        AWS_ACCESS_KEY_ID: "{{aws.access_key_id}}"
        AWS_REGION: "{{aws.region}}"
    source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---
