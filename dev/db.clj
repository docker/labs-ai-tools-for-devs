(ns db 
  (:require
   [jsonrpc.db :as db]
   [markdown :as markdown-parser]
   [prompts.core :as prompts]
   [repl]))

(comment
  (db/add-refs
    (db/registry-refs
      (prompts/registry)))
  (markdown-parser/parse-markdown (slurp "/Users/slim/.prompts-cache/2c622aab-1dc8-5ff0-bfa2-f6b687edeed2/prompts/mcp/resend.md"))
  (-> jsonrpc.db/db* deref keys)
  (-> jsonrpc.db/db* deref :mcp.prompts/registry keys)
  (-> jsonrpc.db/db* deref :mcp.prompts/resources)
  (-> jsonrpc.db/db* deref :mcp.prompts/registry (get "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/mcp/resend.md"))
  (-> jsonrpc.db/db* deref :mcp.prompts/registry (get "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/mcp/brave.md"))
  (-> jsonrpc.db/db* deref :mcp.prompts/registry (get "qrencode"))
  (-> jsonrpc.db/db* deref :mcp.prompts/registry (get "github:docker/labs-ai-tools-for-devs?ref=slim/compose-demo&path=prompts/examples/marp.md"))
  )
