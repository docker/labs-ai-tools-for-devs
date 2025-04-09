---
mcp:
  - container:
      image: mcp/multiversx-mx:latest
      environment:
        MVX_NETWORK: "{{mvx.network}}"
        MVX_WALLET: "{{mvx.wallet}}"
  - source:
      url: https://github.com/multiversx/mx-mcp
---
