id:: 66da266d-79cb-489e-afa3-d205619b6f3e
```
---
tools:
  - name: qrencode
    description: "Run the qrencode command."
    parameters:
      type: object
      properties:
        args:
          type: string
          description: "The arguments to pass to qrencode"
    container:
      image: "vonwig/qrencode:latest"
---

# prompt user

Generate a QR code for the content 
'https://raw.githubusercontent.com/docker/labs-ai-tools-for-devs/main/prompts/qrencode/README.md'.
Save the generated image to `qrcode.png`.
If the command fails, read the man page and try again.
d fails, read the man page and try again.
```
