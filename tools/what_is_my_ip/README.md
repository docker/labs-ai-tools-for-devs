## Background

This tool is based on a [post][learn-nix]. It's a good proven way to extract a host ip from a 
docker container (that is using host networking).

### Function

Add this function definition to any set of prompts that might need to extract the host IP address.

```yaml
- container:
    image: vonwig/what-is-my-ip:latest
  name: what-is-my-ip
  description: Get the host IP address for this machine.
```

[learn-nix]:https://fzakaria.com/2024/07/05/learn-nix-the-fun-way.html

