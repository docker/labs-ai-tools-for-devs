---
tools:
  - name: stable-diffusion
    description: generate an image using stable diffusion
    parameters:
      type: object
      properties:
        prompt:
          type: string
          description: a description of the image that should be generated
    type: prompt
    ref: "github:docker/labs-ai-tools-for-devs?path=prompts/stable-diffusion/image-generation-service.md&ref=slim/stable-diffusion"
---

# prompt user

Use stable diffusion to generate an image of `a lone cyclist riding in the moonlight`.
