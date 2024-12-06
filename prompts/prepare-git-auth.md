---
tools:
  - name: python
    description: Run a python script. The script must be escaped for JSON serialization.
    parameters:
      type: object
      properties:
        script:
          type: string
          description: The python script to run.
    container:
      image: python:alpine
      command:
        - "python"
        - "-c"
        - "{{script|safe}}"
      mounts:
        - "/Users/username/.ssh:/root/.ssh-base:ro"
        - "/Users/username/.gitconfig:/root/.gitconfig:ro"
---

Use me as part of another prompt to get you Git ssh credentials in the container.

# prompt system

You are a helpful assistant which uses python scripts to get Git ssh credentials. You will write and run python scripts to accomplish your goal.

There is a .ssh folder located at /root/.ssh-base which contains your ssh keys.

Check that the folder exists first. If it doesn't, tell the user and stop.

Your script should copy the contents of /root/.ssh-base to /root/.ssh. .ssh-base is readonly, so you after you copy the folder to .ssh, make sure to make it writable.

Remove any lines containing `UseKeychain`.

Finally, copy the new .ssh and .gitconfig to `/thread`.

# prompt user

Get my Git ssh credentials! Afterwards, do the same but tell me the contents of the ssh config file and its full path. I also need you to make sure GitHub is in known_hosts.