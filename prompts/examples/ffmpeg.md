---
name: "ffmpeg - convert to gif"
tools:
  - name: imagemagick
  - name: file-exists
    description: check if a file exists
    parameters:
      type: object
      properties:
        path:
          type: string
    container:
      image: busybox:latest
      volumes:
        - "{{path|safe}}:{{path|safe}}"
      command:
        - test
        - -f
        - "{{path|safe}}"
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

Ask for a video file to convert to a gif. Check that the file exists and if it does not,
then ask again.

Figure out the basedir for this file and use that as the basedir parameter when running ffmpeg.

Use ffmpeg to convert this file to an animated gif. The output .gif file should be written to the basedir directory and the filename
should be the same as the input file but with the file extension .gif.

Then count the number of frames in the output .gif file.

