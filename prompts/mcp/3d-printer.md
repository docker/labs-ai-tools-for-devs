---
mcp:
  - container:
      image: mcp/3d-printer:latest
      workdir: /app
      secrets:
        3d-printer-server.token: BAMBU_TOKEN
      environment:
        BAMBU_SERIAL: "{{3d-printer.serial}}"
        PRINTER_HOST: "{{3d-printer.host|safe}}"
        PRINTER_TYPE: "{{3d-printer.type}}"
    source:
      url: https://github.com/DMontgomery40/mcp-3D-printer-server/tree/main
---
