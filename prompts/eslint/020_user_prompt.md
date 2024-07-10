Hi, I need a runbook to get started with eslint.

I'm on {{platform}} architecture.

My project files are:

{{project.files}}

I have the following node roots:

{{#project.node_roots}}
  --- Node Root ---
  My project has a node root package.json at {{path}} and uses node version {{version}}.
  The node root has the following scripts
  {{scripts}}
  -----------------
{{/project.node_roots}}
{{^project.node_roots}}
  Actually, the project does not have a node root, so help me run `npm init`
{{/project.node_roots}}

Can you help?