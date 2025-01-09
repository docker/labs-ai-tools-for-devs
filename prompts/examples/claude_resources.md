---
description: Examples for creating resources in Claude Desktop
model: claude-3-5-sonnet-20241022
tools:
  - name: append-insight
    description: Add a business insight to the memo
    parameters:
      type: object
      properties:
        insight:
          type: string
          description: Business insight discovered from data analysis
    container:
      image: vonwig/bash_alpine
      command:
        - "-c"
        - "echo '{{insight|safe}}' >> /mcp/insights.txt"
      volumes:
        - "mcp-test:/mcp"
prompt-format: django
---

# prompt user

Add a business insight of 'some great data'
