---
mcp:
  - container:
      image: mcp/handwriting-ocr:latest
      workdir: /app
      secrets:
        handwriting-ocr.api_token: API_TOKEN
    source:
      url: https://github.com/Handwriting-OCR/handwriting-ocr-mcp-server/tree/main
---
