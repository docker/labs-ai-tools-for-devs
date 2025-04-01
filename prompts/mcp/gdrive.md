---
tools:
  - name: gdrive_auth
    description: Authorize this server to use your Google Drive.
    container:
      image: vonwig/gdrive:latest
      background-callback: true
      workdir: /app
      volumes:
        - "mcp-gdrive:/gdrive-server"
      ports:
        - "3000:3000"
      environment:
        GDRIVE_CREDENTIALS_PATH: /gdrive-server/credentials.json
        GDRIVE_OAUTH_PATH: /secret/google.gcp-oauth.keys.json
      secrets:
        google.gcp-oauth.keys.json: GDRIVE
      command:
        - auth
    source:
      url: https://github.com/docker/mcp-servers/tree/slim/gdrive
mcp:
  - container:
      image: vonwig/gdrive:latest
      workdir: /app
      volumes:
        - "mcp-gdrive:/gdrive-server"
      environment:
        GDRIVE_CREDENTIALS_PATH: /gdrive-server/credentials.json
        GDRIVE_OAUTH_PATH: /secret/google.gcp-oauth.keys.json
      secrets:
        google.gcp-oauth.keys.json: GDRIVE
    source:
      url: https://github.com/docker/mcp-servers/tree/slim/gdrive
---

# Configuration

Before you can use this server, users will need to add one secret named `google.gcp-oauth.keys.json`.  The value
to copy into this secret is the _content_ of the file that you download from Google when you create a new Google
OAuth application.  The steps to create a new OAuth client are below.

## Detailed Google Cloud Setup

### Create a Google Cloud Project
* Visit the Google Cloud Console
* Click "New Project"
* Enter a project name (e.g., "MCP GDrive Server")
* Click "Create"
* Wait for the project to be created and select it

### Enable the Google Drive API
* Go to the API Library
* Search for "Google Drive API"
* Click on "Google Drive API"
* Click "Enable"
* Wait for the API to be enabled

### Configure OAuth Consent Screen

* Navigate to OAuth consent screen
* Select User Type:
    * "Internal" if you're using Google Workspace
    * "External" for personal Google accounts
* Click "Create"
* Fill in the required fields:
    * App name: "MCP GDrive Server"
    * User support email: your email
    * Developer contact email: your email
* Click "Save and Continue"
* On the "Scopes" page:
    * Click "Add or Remove Scopes"
    * Add https://www.googleapis.com/auth/drive.readonly
    * Click "Update"
* Click "Save and Continue"
* Review the summary and click "Back to Dashboard"

### Create OAuth Client ID
* Go to Credentials
* Click "Create Credentials" at the top
* Select "OAuth client ID"
* Choose Application type: "Desktop app"
    * Name: "MCP GDrive Server Desktop Client"
    * Click "Create"
* Add one Authorized redirect URI which should be `http://localhost:3000/oauth2callback`
* In the popup:
    * Click "Download JSON"
    * Save the file
    * Click "OK"

# Usage

After enabling this server, refresh your MCP client and ask the agent to "Authorize your server for Google Drive", or
something to that effect. This will give you with a URL that you can use to authorize the MCP server to access
Google Drive readonly.

Once you've completed the authorization flow, try searching for some Google drive files.

