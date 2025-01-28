---
name: "ffmpeg - convert to gif"
tools:
  - name: imagemagick
  - name: ffmpeg
    description: run the ffmpeg command
    parameters:
      type: object
      properties:
        basedir:
          type: string
        args:
          description: arguments to pass to ffmpeg
          type: array
          items:
            type: string
    container:
      image: linuxserver/ffmpeg:version-7.1-cli
      volumes:
        - "{{basedir|safe}}:{{basedir|safe}}"
      command:
        - "{{args|into}}"
model: claude-3-5-sonnet-20241022
---

# prompt user

You will convert /Users/slim/vids/UsingPuppeteer.mp4 to a gif using ffmpeg.

Figure out the basedir for this file and use that as the basedir parameter when running ffmpeg.

Use ffmpeg to convert this file to an animated gif. The output .gif file should be written to the /thread directory and the filename
should be the same as the input file but with the file extension .gif.

Then count the number of frames in the output .gif file.

