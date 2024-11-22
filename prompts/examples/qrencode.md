---
tools:
  - name: qrencode
---

# Prompt user

Generate a QR code for the content 
'https://github.com/docker/labs-ai-tools-for-devs'.
Save the generated image to `qrcode.png`.
If the command fails, read the man page and try again.
If successful, output the path to the generated image in markdown syntax.

# Testing

After running the above prompt, there should be a file named `qrcode.png` in the current project's host directory.

```bash
open ~/vonwig/altaservice/qrcode.png
```

