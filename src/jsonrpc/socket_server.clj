(ns jsonrpc.socket-server
  (:require
   [jsonrpc.logger :as logger]
   [lsp4clj.io-server :as io-server]
   [lsp4clj.server :as server])
  (:import
   [java.net InetAddress ServerSocket Socket]))

(set! *warn-on-reflection* true)

(defn server
  "Start a socket server, given the specified opts:
    `:address` Host or address, string, defaults to loopback address
    `:port` Port, string or integer, required

  Starts listening on the socket, blocks until a client establishes a
  connection, then returns a chan-server which communicates over the socket."
  ([{:keys [address port server-context-factory] :as opts}]
   (let [socket (ServerSocket. (if (string? port) (Long/valueOf ^String port) port) 0)] ;; bind to the port
     (loop [connection (.accept socket)]
       (logger/info "accepted connection")
       (server opts connection server-context-factory)
       (recur (.accept socket)))))
  ([opts ^Socket connection component-factory] ;; this arity is mostly for tests
   ;; chan servers have on-close callbacks
   ;; connections have both input and output streams
   (let [on-close #(do 
                     (.close connection))
         s (io-server/server (assoc opts
                                    :in connection
                                    :out connection
                                    :on-close on-close))]
     (server/start s (component-factory s)))))

