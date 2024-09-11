---
tools:
  - name: fix-pylint-violation
    description: fix a pylint violation
    parameters:
      type: object
      properties:
        code:
          type: string
          description: the code block
        violation:
          type: string
          description: the description of the violation
    prompt:
      ref: github:docker/labs-ai-tools-for-devs?path=prompts/pylint/fix-violation.md
  - name: sqlite
---

# prompt user

I am looking at line 17 of src/app.py.

Find the code and violation at this location.

Now fix the the pylint violation.
