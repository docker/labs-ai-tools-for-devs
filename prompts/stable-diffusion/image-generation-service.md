---
tools:
  - name: curl
---

# prompt user

Use the curl command to send a POST request to http://host.docker.internal:8000/generate with the following JSON payload:

```json
{
    "prompt": "A futuristic cityscape",
    "height": 512, "width": 512,
    "num_inference_steps": 50
}
```

but change the prompt to `{{prompt}}`

