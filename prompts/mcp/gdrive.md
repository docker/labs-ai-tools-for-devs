---
tools:
  - name: gdrive_auth
    description: Authorize this server to use your Google Drive.
    container:
      image: mcp/gdrive:latest
      background: true
      volumes:
        - "mcp-gdrive:/gdrive-server"
      ports:
        - "3000:3000"
      environment:
        GDRIVE_CREDENTIALS_PATH: /gdrive-server/credentials.json
        GDRIVE_OAUTH_PATH: /secret/gdrive.gcp-oauth.keys.json
      secrets:
        google.gcp-oauth.keys.json: GDRIVE
      command:
        - auth
mcp:
  - container:
      image: vonwig/gdrive:latest
      workdir: /app
      volumes:
        - "mcp-gdrive:/gdrive-server"
      environment:
        GDRIVE_CREDENTIALS_PATH: /gdrive-server/credentials.json
---

