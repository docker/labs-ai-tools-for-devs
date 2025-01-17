---
title: use ffmpeg
---

# Description

Use ffmpeg to convert an mp4 file to an animated gif.

Users must refer to the mp4 file using a relative path from the working directory they've given to the mcp 
bridge server.

# Prompt Code

```markdown
---
tools:
  - name: ffmpeg
    description: run the ffmpeg command
    parameters:
      type: object
      properties:
        args:
          description: arguments to pass to ffmpeg
          type: array
          items:
            type: string
    container:
      image: linuxserver/ffmpeg:version-7.1-cli
      command:
        - "{{args|into}}"
---

# prompt

Use ffmpeg to convert the file UsingPuppeteer.mp4 into an animated gif file at 1 frame per second.
The output file should be named UsingPuppeteer.gif.
```

