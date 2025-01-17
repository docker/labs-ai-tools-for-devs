---
title: call swagger api
---

# Description

Describe a two step process where we first grab a swagger.json file from the web and then use
that to make an api call.

# Prompt Code

```markdown
---
tools:
  - name: curl
---

# prompt

Use curl to fetch the openai spec at https://fakerestapi.azurewebsites.net/swagger/v1/swagger.json
Then use curl to get all authors from the api.
```

