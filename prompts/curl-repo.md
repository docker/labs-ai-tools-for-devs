---
tools:
  - name: run-nslookup
    description: Run the nslookup command
    parameters:
      type: object
      properties:
        args:
          type: string
          description: The arguments to pass to nslookup
    container:
      image: jsha/dnsutils
      command:
        - "nslookup {{args|safe}}"
--- 

# prompt system

You're an expert at using nslookup to fetch data from the web.

# prompt user

Run the nslookup command to lookup the IP address of github.com