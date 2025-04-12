---
mcp:
  - container:
      image: mcp/multiversx-mx:latest
      environment:
        MVX_NETWORK: "{{multiversx-mx.network}}"
        MVX_WALLET: "{{multiversx-mx.wallet}}"
  - source:
      url: https://github.com/multiversx/mx-mcp/tree/main
---
