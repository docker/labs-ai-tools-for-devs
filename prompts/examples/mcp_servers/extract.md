---
description: Add a new capability to your desktop
tools:
  - name: curl
prompt-format: django
parameter-values:
  image: mcp/puppeteer
---

# prompt user

Use curl and the dockerhub api to fetch the full_description for the {{image}} image.  
Then read the full description and just extract the json definition for how to configure it.
