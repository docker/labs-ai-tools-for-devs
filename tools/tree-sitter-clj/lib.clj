(ns lib
  (:require [clojure.java.io :as io])
  (:import [com.sun.jna Native Platform Memory]
           [com.docker TreeSitterLibrary]))

;; Define the interface for your library
(def my-language
  (gen-interface
    :name "com.docker.TreeSitterMarkdown"
    :extends [com.sun.jna.Library]
    :methods [[tree_sitter_markdown [] com.docker.TreeSitterLibrary$TSLanguage]]))

(def language-lib (Native/loadLibrary "tree-sitter-markdown" my-language))

;; Load the library
(def lib (Native/loadLibrary "tree-sitter" TreeSitterLibrary))

;; Now you can call functions from the library
(defn call-some-function []
  (.ts_parser_new lib))

(def parser (.ts_parser_new lib))

(def content "# Hello world!!\n\nmore stuff\n")
(def input-bytes (.getBytes content "UTF-16LE"))
(def input-memory (Memory. (inc (alength input-bytes))))
(.write input-memory 0 input-bytes 0 (alength input-bytes))
(.setByte input-memory (alength input-bytes) (byte 0))  ; Add null terminator

(def tree (.ts_parser_parse_string lib parser nil input-memory (inc (alength input-bytes))))

(comment
  (.ts_node_is_null lib tree)

  (.ts_tree_root_node lib tree)
  (println (.ts_node_type lib (.ts_tree_root_node lib tree))))

