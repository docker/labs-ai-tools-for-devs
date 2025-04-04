---
name: Marker PDF Converter
description: Marker converts PDF documents to markdown, JSON, and HTML quickly and accurately. Converts PDF, image, PPTX, DOCX, XLSX, HTML, EPUB files in all languages. Formats tables, forms, equations, inline math, links, references, and code blocks. Extracts and saves images. Removes headers/footers/other artifacts.
tools:
  - name: marker_single
    description: Convert a single pdf file to markdown
    parameters:
      type: object
      properties:
        marker_args:
          type: array
          items:
            type: string
          description: The arguments to pass to the marker command. If the user does not provide a place to save the output, use /thread/marker as the default output location.
      required:
        - marker_args
    container:
      image: jdamp/marker:latest
      command:
        - poetry
        - run
        - python
        - convert_single.py
        - "{{marker_args|into}}"
  - name: marker
    description:  Convert a directory of pdf files to markdown. You can also use `--workers n` to convert multiple files in parallel, where `n` is the number of workers to use. If the user does not provide a place to save the output, use /thread/marker as the default output location.
    parameters:
      type: object
      properties:
        marker_args:
          type: array
          items:
            type: string
          description: The arguments to pass to the marker command.
      required:
        - marker_args
    container:
      image: jdamp/marker:latest
      command:
        - poetry
        - run
        - python
        - convert.py
        - "{{marker_args|into}}"
---

# prompt

I have a pdf in /thread/Building-a-Sustainable-Business_2024.pdf. Can you convert it to markdown?