
## ROLE assistant
{
  "content": "You are an expert in writing poems about Git repositories.",
  "role": "system"
}
{
  "content": "My project uses the following languages:\n\n* Bicep\n* Dockerfile\n* JSON\n* Jupyter Notebook\n* OASv2-yaml\n* Text\n\nMy project has the following files:\n\n[&quot;/project/infra/abbreviations.json&quot; &quot;/project/infra/core/database/cosmos-mongo-db.bicep&quot; &quot;/project/infra/core/database/cosmos-mongo-account.bicep&quot; &quot;/project/infra/core/database/cosmos-sql-db.bicep&quot; &quot;/project/infra/core/database/cosmos-account.bicep&quot; &quot;/project/infra/core/database/cosmos-sql-role-assign.bicep&quot; &quot;/project/infra/core/database/cosmos-sql-account.bicep&quot; &quot;/project/infra/core/database/sqlserver.bicep&quot; &quot;/project/infra/core/database/cosmos-sql-role-def.bicep&quot; &quot;/project/infra/core/monitor/loganalytics.bicep&quot; &quot;/project/infra/core/monitor/monitoring.bicep&quot; &quot;/project/infra/core/host/container-apps-environment.bicep&quot; &quot;/project/infra/core/host/container-app.bicep&quot; &quot;/project/infra/core/host/container-registry.bicep&quot; &quot;/project/infra/core/host/container-apps.bicep&quot; &quot;/project/infra/core/security/keyvault-access.bicep&quot; &quot;/project/infra/core/security/keyvault.bicep&quot; &quot;/project/infra/core/storage/storage-account.bicep&quot; &quot;/project/infra/app/web.parameters.json&quot; &quot;/project/infra/app/web.bicep&quot; &quot;/project/infra/main.parameters.json&quot; &quot;/project/infra/main.bicep&quot; &quot;/project/infra/resources.bicep&quot; &quot;/project/LICENSE&quot; &quot;/project/requirements.txt&quot; &quot;/project/Dockerfile&quot; &quot;/project/demo.png&quot; &quot;/project/.devcontainer/devcontainer.json&quot; &quot;/project/notebook.png&quot; &quot;/project/README.md&quot; &quot;/project/poem.md&quot; &quot;/project/.gitignore&quot; &quot;/project/.gitattributes&quot; &quot;/project/.vscode/extensions.json&quot; &quot;/project/docker-labs-ai-tools-for-devs-prompts-poem.md&quot; &quot;/project/azure.yaml&quot; &quot;/project/demo.gif&quot; &quot;/project/src/demo.ipynb&quot;]\n\nWrite me a poem in the style of Supa Hot Fire.\n\nWrite it as a poem.md file to the root of the project.\n",
  "role": "user"
}
# Rendered Prompt

{
{
  "files": [
    {
      "path": "/project/poem.md",
      "content": "# Supa Hot Fire Poem\n\nIn the realm where the programmers roam,\nLies a project with a Git home.\nBicep, Docker, and JSON, you see,\nWeave a code tapestry.\n\nJupyter notebooks with their grace,\nOASv2-yaml finds its place.\nIn files that dance in a rhythmic ballet,\nFrom cosmos-mongo-db to web.bicep, they sway.\n\nFrom the depths of infra, the core rises,\nSQL and Docker, full of surprises.\nContainer-apps in their harmonious role,\nA sublime canvas, as elusive as a black hole.\n\nKeyvault-security, oh, how it shines,\nIn the dance with storage, creating lines.\nDockerfile, amid the fore,\nCreating images galore.\n\nA demo paints a thousand words,\nWhile README gives flight to knowledge birds.\nOh, Gitignore, with your unseen power,\nYou shield us in the compile hour.\n\nIn the realm where the coders dwell,\nIs a project with stories to tell.\nBicep, Dockerfile, JSON, unite!\nIn this orchestra of code delight.\n\nSupa Hot Fire, the poet declares,\nThe passion for this project in every stanza it bears.",
      "executable": false
    }
 ]
 ]

```
# Debug
{:tool-calls {0 {:function {:name "write_files", :arguments "{\n  \"files\": [\n    {\n      \"path\": \"/project/poem.md\",\n      \"content\": \"# Supa Hot Fire Poem\\n\\nIn the realm where the programmers roam,\\nLies a project with a Git home.\\nBicep, Docker, and JSON, you see,\\nWeave a code tapestry.\\n\\nJupyter notebooks with their grace,\\nOASv2-yaml finds its place.\\nIn files that dance in a rhythmic ballet,\\nFrom cosmos-mongo-db to web.bicep, they sway.\\n\\nFrom the depths of infra, the core rises,\\nSQL and Docker, full of surprises.\\nContainer-apps in their harmonious role,\\nA sublime canvas, as elusive as a black hole.\\n\\nKeyvault-security, oh, how it shines,\\nIn the dance with storage, creating lines.\\nDockerfile, amid the fore,\\nCreating images galore.\\n\\nA demo paints a thousand words,\\nWhile README gives flight to knowledge birds.\\nOh, Gitignore, with your unseen power,\\nYou shield us in the compile hour.\\n\\nIn the realm where the coders dwell,\\nIs a project with stories to tell.\\nBicep, Dockerfile, JSON, unite!\\nIn this orchestra of code delight.\\n\\nSupa Hot Fire, the poet declares,\\nThe passion for this project in every stanza it bears.\",\n      \"executable\": false\n    }\n  ]\n}"}, :id "call_8VG0ogLnVtJ69wnIQ5htdXev"}}, :finish-reason "tool_calls"}

```


## ROLE tool
 function call write_files failed call exited with non-zero code (1): #error {
 :cause /project/poem.md is not a relative path
 :via
 [{:type java.lang.IllegalArgumentException
   :message /project/poem.md is not a relative path
   :at [clojure.java.io$as_relative_path invokeStatic io.clj 414]}]
 :trace
 [[clojure.java.io$as_relative_path invokeStatic io.clj 414]
  [clojure.java.io$file invokeStatic io.clj 426]
  [clojure.java.io$file invoke io.clj 418]
  [clojure.lang.AFn applyToHelper AFn.java 156]
  [clojure.lang.RestFn applyTo RestFn.java 132]
  [clojure.core$apply invokeStatic core.clj 667]
  [babashka.fs$file invokeStatic fs.cljc 61]
  [babashka.fs$file doInvoke fs.cljc 61]
  [clojure.lang.RestFn invoke RestFn.java 423]
  [sci.lang.Var invoke lang.cljc 202]
  [sci.impl.analyzer$return_call$reify__4562 eval analyzer.cljc 1422]
  [sci.impl.analyzer$analyze_let_STAR_$reify__4232 eval analyzer.cljc 625]
  [sci.impl.analyzer$return_do$reify__3977 eval analyzer.cljc 130]
  [sci.impl.analyzer$analyze_let_STAR_$reify__4240 eval analyzer.cljc 695]
  [sci.impl.analyzer$return_if$reify__4272 eval analyzer.cljc 866]
  [sci.impl.fns$fun$arity_4__1186 invoke fns.cljc 110]
  [sci.impl.analyzer$return_call$reify__4568 eval analyzer.cljc 1422]
  [sci.impl.analyzer$analyze_let_STAR_$reify__4238 eval analyzer.cljc 672]
  [sci.impl.analyzer$return_do$reify__3977 eval analyzer.cljc 130]
  [sci.impl.analyzer$analyze_let_STAR_$reify__4232 eval analyzer.cljc 627]
  [sci.impl.evaluator$eval_try invokeStatic evaluator.cljc 83]
  [sci.impl.analyzer$analyze_try$reify__4309 eval analyzer.cljc 968]
  [sci.impl.fns$fun$arity_0__870 doInvoke fns.cljc 83]
  [clojure.lang.RestFn applyTo RestFn.java 137]
  [clojure.core$apply invokeStatic core.clj 667]
  [clojure.core$apply invoke core.clj 662]
  [sci.lang.Var invoke lang.cljc 202]
  [sci.impl.analyzer$return_call$reify__4562 eval analyzer.cljc 1422]
  [sci.impl.fns$fun$arity_0__1164 invoke fns.cljc 106]
  [sci.lang.Var invoke lang.cljc 198]
  [sci.impl.analyzer$return_call$reify__4554 eval analyzer.cljc 1422]
  [sci.impl.interpreter$eval_form invokeStatic interpreter.cljc 40]
  [sci.impl.interpreter$eval_string_STAR_ invokeStatic interpreter.cljc 66]
  [sci.impl.interpreter$eval_string_STAR_ invoke interpreter.cljc 57]
  [sci.impl.interpreter$eval_string_STAR_ invokeStatic interpreter.cljc 59]
  [sci.core$eval_string_STAR_ invokeStatic core.cljc 270]
  [babashka.main$exec$fn__32114$fn__32152$fn__32153 invoke main.clj 1043]
  [babashka.main$exec$fn__32114$fn__32152 invoke main.clj 1043]
  [babashka.main$exec$fn__32114 invoke main.clj 1033]
  [clojure.lang.AFn applyToHelper AFn.java 152]
  [clojure.lang.AFn applyTo AFn.java 144]
  [clojure.core$apply invokeStatic core.clj 667]
  [clojure.core$with_bindings_STAR_ invokeStatic core.clj 1990]
  [clojure.core$with_bindings_STAR_ doInvoke core.clj 1990]
  [clojure.lang.RestFn invoke RestFn.java 425]
  [babashka.main$exec invokeStatic main.clj 823]
  [babashka.main$main invokeStatic main.clj 1189]
  [babashka.main$main doInvoke main.clj 1142]
  [clojure.lang.RestFn applyTo RestFn.java 137]
  [clojure.core$apply invokeStatic core.clj 667]
  [babashka.main$_main invokeStatic main.clj 1222]
  [babashka.main$_main doInvoke main.clj 1214]
  [clojure.lang.RestFn applyTo RestFn.java 137]
  [babashka.main main nil -1]
  [java.lang.invoke.LambdaForm$DMH/sa346b79c invokeStaticInit LambdaForm$DMH -1]]}

## ROLE assistant
{
{
  "files": [
    {
      "path": "poem.md",
      "content": "# Supa Hot Fire Poem\n\nIn the realm where the programmers roam,\nLies a project with a Git home.\nBicep, Docker, and JSON, you see,\nWeave a code tapestry.\n\nJupyter notebooks with their grace,\nOASv2-yaml finds its place.\nIn files that dance in a rhythmic ballet,\nFrom cosmos-mongo-db to web.bicep, they sway.\n\nFrom the depths of infra, the core rises,\nSQL and Docker, full of surprises.\nContainer-apps in their harmonious role,\nA sublime canvas, as elusive as a black hole.\n\nKeyvault-security, oh, how it shines,\nIn the dance with storage, creating lines.\nDockerfile, amid the fore,\nCreating images galore.\n\nA demo paints a thousand words,\nWhile README gives flight to knowledge birds.\nOh, Gitignore, with your unseen power,\nYou shield us in the compile hour.\n\nIn the realm where the coders dwell,\nIs a project with stories to tell.\nBicep, Dockerfile, JSON, unite!\nIn this orchestra of code delight.\n\nSupa Hot Fire, the poet declares,\nThe passion for this project in every stanza it bears.",
      "executable": false
    }
 {
  "jsonrpc": "2.0",
  "method": "functions-done",
  "params": [
    {
      "function": {
        "name": "write_files",
        "arguments": "{\n  \"files\": [\n    {\n      \"path\": \"poem.md\",\n      \"content\": \"# Supa Hot Fire Poem\\n\\nIn the realm where the programmers roam,\\nLies a project with a Git home.\\nBicep, Docker, and JSON, you see,\\nWeave a code tapestry.\\n\\nJupyter notebooks with their grace,\\nOASv2-yaml finds its place.\\nIn files that dance in a rhythmic ballet,\\nFrom cosmos-mongo-db to web.bicep, they sway.\\n\\nFrom the depths of infra, the core rises,\\nSQL and Docker, full of surprises.\\nContainer-apps in their harmonious role,\\nA sublime canvas, as elusive as a black hole.\\n\\nKeyvault-security, oh, how it shines,\\nIn the dance with storage, creating lines.\\nDockerfile, amid the fore,\\nCreating images galore.\\n\\nA demo paints a thousand words,\\nWhile README gives flight to knowledge birds.\\nOh, Gitignore, with your unseen power,\\nYou shield us in the compile hour.\\n\\nIn the realm where the coders dwell,\\nIs a project with stories to tell.\\nBicep, Dockerfile, JSON, unite!\\nIn this orchestra of code delight.\\n\\nSupa Hot Fire, the poet declares,\\nThe passion for this project in every stanza it bears.\",\n      \"executable\": false\n    }\n  ]\n}"
      },
      "id": "call_aq52FjvuDeprMI0iQIQXj5eQ"
    }
  ]
}]
 ]

## ROLE tool (write_files)
wrote 1 files: poem.md


## ROLE assistant
The been has poem to written successfully.md poem the the in file the of root. projecta Sup the! verse styled Fire Hot
```
# Debug
{:finish-reason "stop",
 :messages
 [{:role "assistant",
   :content
   "The poem has been successfully written to the poem.md file in the root of the project. Enjoy the Supa Hot Fire styled verse!"}]}


```

{"done":"stop"}