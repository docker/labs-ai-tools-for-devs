---
tools:
  - name: imagemagick
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

# prompt user

Use ffmpeg to convert the file UsingPuppeteer.mp4 into an animated gif file at 1 frame per second.
The output file should be named UsingPuppeteer.gif.

Then count the number of frames in UsingPuppeteer.gif.
