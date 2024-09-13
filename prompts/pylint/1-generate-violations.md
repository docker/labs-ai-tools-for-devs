---
tools:
  - name: pylint
    check-exit-code: false
---

# Pylint

# #prompt user

Get the man page for pylint

## Comments

I should be able to ask a tool how to use it and we need to support non-zero exit codes

```sh
docker run -it --rm vonwig/pylint:latest '{}' man
```

# prompt user

Run pylint with the arguments `-f json --output /thread/violations.json **/*.py`

