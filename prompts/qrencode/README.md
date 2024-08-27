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

# Prompt user

Generate a QR code for the 
url https://github.com/docker/labs-ai-tools-for-devs and write it to file `qrcode.png`.
 
# Result

This function generates a QR code for a URL. The QR code is saved as a PNG file.
