---
mcp:
  - container:
      image: mcp/razorpay:latest
      workdir: /app
      secrets:
        razorpay.key_secret: RAZORPAY_KEY_SECRET
      environment:
        RAZORPAY_KEY_ID: "{{razorpay.key_id}}"
    source:
      url: https://github.com/razorpay/razorpay-mcp-server/tree/main
---
