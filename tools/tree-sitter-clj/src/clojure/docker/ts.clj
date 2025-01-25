(ns docker.ts
  (:import
   [io.github.treesitter.jtreesitter
    Language
    Node
    Parser
    Tree
    QueryMatch
    Query]
   [java.lang.foreign Arena SymbolLookup]
   [java.util Optional]
   [java.util.stream Stream])
  (:gen-class))

(set! *warn-on-reflection* true)

(defn load-language [l s]
  (let [lib (System/mapLibraryName l)]
    (Language/load (SymbolLookup/libraryLookup lib (Arena/global)) s)))

(comment
  (def markdown-language (load-language "tree-sitter-markdown" "tree_sitter_markdown"))
  (def python-language (load-language "tree-sitter-python" "tree_sitter_python")))

(defn ->sexp [tree]
  (.toSexp
    ^Node (.getRootNode 
      ^Tree (.get ^Optional tree))))

;; Create a query
(def query-string "(module [(function_definition)
                            (class_definition)] @top-level)")

;; Process the matches
(defn -main [& _]
  (let [parser (Parser.)
        python-language (load-language "tree-sitter-python" "tree_sitter_python")
        content (slurp *in*)] ; Read all content from stdin
    (.setLanguage parser python-language)
    (let [tree (.parse parser content)
          _ (println (->sexp tree))
          query (.query ^Language python-language query-string)
          matches (.findMatches ^Query query ^Node (.getRootNode ^Tree (.get ^Optional tree)))
          match-iterator (.iterator ^Stream matches)]

      (doseq [match (iterator-seq match-iterator)]
        (doseq [node (.findNodes ^QueryMatch match "top-level")]
          (let [start-byte (.getStartByte ^Node node)
                end-byte (.getEndByte ^Node node)]
            (println (str "Found heading from " start-byte " to " end-byte ": "
                          (subs content start-byte end-byte))))))
      (println "finished"))))

