I have the following project open:

--- Project ---

My project has these files:
{{#project.files}}
  {{.}}
{{/project.files}}

If you see that I have a yarn.lock, please use `yarn` in place of npm commands.

{{#project.node_roots}}
  --- Node Root ---
  My project has a node root package.json at {{path}} and uses node version {{version}}.
  The node root has the following scripts
  {{scripts}}
  -----------------
{{/project.node_roots}}
{{^project.node_roots}}
  The project does not have a node root, so help me run `npm init`
{{/project.node_roots}}

--- End Project ---

Please generate a runbook for me.
