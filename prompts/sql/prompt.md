---
tools:
  - name: curl
  - name: sql-agent
    description: Execute a SQL query against a sqlite database
    parameters:
      type: object
      properties:
        database:
          type: string
          description: the sqlite database file
        prompt:
          type: string
          description: a human description of the query we need to run
    type: "prompt"
    prompt: github:docker/labs-ai-tools-for-devs?path=prompts/sql/sql-agent.md
host-dir: /Users/slim/docker/labs-ai-tools-for-devs/prompts/sql  # override host-dir while testing
---

# prompt user

1.  use curl to download 'https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db' and write to ./Chinook.db
2.  use the sql-agent tool to run the following prompt.

> find all artists 

Do not try to generate sql. Pass this prompt directly to the agent.  
