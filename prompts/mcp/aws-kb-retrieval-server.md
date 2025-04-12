---
mcp:
  - container:
      image: mcp/aws-kb-retrieval-server:latest
      workdir: /app
      secrets:
        aws.access_key_id: AWS_ACCESS_KEY_ID
        aws.secret_access_key: AWS_SECRET_ACCESS_KEY
        aws.region: AWS_REGION
  - source:
      url: https://github.com/modelcontextprotocol/servers/tree/2025.4.6
---
