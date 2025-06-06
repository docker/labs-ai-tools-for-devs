(ns messages)

(defn initialize [id]
  {:jsonrpc "2.0"
   :method "initialize"
   :id id
   :params {:protocolVersion "2024-11-05"
            :capabilities {}
            :clientInfo {:name "SSE Client" :version "0.1"}}})
