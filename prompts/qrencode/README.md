---
tool_choice: auto
functions:
  - name: qrencode
    description: "Generate a QR code for a URL"
    parameters:
      type: object
      properties:
        url:
          description: "The URL to encode"
          type: string
        filename:
          type: string
          description: "The name of the PNG file to write"
    container:
      image: vonwig/qrencode:latest
---

