---
name: qrencode
description: generate a QR code
tools:
  - name: qrencode
    description: generate a QR code and write it to /thread/qrcode.png
    parameters:
      type: object
      properties:
        args:
          type: string
          description: The arguments to pass to qrencode
    container:
      image: vonwig/qrencode:latest
      command:
        - "{{raw|safe}}"
---

# Background

Use the qrencode binary to generate QR codes and return them as MCP resources.
This will require MCP clients that support resources because the output of qrencode is binary data.

```bash
open ~/docker/labs-ai-tools-for-devs/qrcode.png
```

