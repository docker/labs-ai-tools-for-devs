---
tools:
  - name: marp-create
    description: Create a new Marp presentation
    parameters:
      type: object
      properties:
        root:
          type: string
          description: Absolute path to the presentation content
        presentation:
          type: string
          description: Relative path from root to the presentation markdown file
        output:
          type: string
          description: The output format (must be either pdf, html, or pptx)
    container:
      image: marpteam/marp-cli:latest
      environment:
        LANG: en_US.UTF-8
      volumes:
        - "{{root}}:/home/marp/app"
      command:
        - "{{presentation}}"
        - "--{{output}}"
---
