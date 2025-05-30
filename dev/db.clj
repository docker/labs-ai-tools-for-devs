(ns db 
  (:require
   [jsonrpc.db :as db]
   [repl]))

(ns-publics 'jsonrpc.db)

(comment
  (-> jsonrpc.db/db* deref keys)
  (-> jsonrpc.db/db* deref :mcp.prompts/registry keys)
  (-> jsonrpc.db/db* deref :mcp.prompts/resources)
  (-> jsonrpc.db/db* deref :mcp.prompts/registry (get "github:docker/labs-ai-tools-for-devs?ref=main&path=prompts/mcp/brave.md"))
  )
