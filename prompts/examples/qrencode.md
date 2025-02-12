---
name: qrencode
description: Generate QR codes
tools:
  - name: qrencode
arguments:
  - name: content
    description: the content to encode in the QR code
    required: true
parameter-values:
  content: https://github.com/docker/labs-ai-tools-for-devs
---

# prompt

## description

Generate a QR code

## content

Generate a QR code for the content '{{content}}' and write the output to the file `/thread/qrcode.png`.
If the command fails, read the man page and try again.
If successful, output the path to the generated image in markdown syntax.

# Testing

After running the above prompt, there should be a file named `qrcode.png` in the current project's host directory.

```bash
open ~/docker/labs-ai-tools-for-devs/qrcode.png
```

