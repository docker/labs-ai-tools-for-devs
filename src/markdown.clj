(ns markdown
  (:require
   [cheshire.core :as json]
   [clj-yaml.core :as clj-yaml]
   [clojure.core.async :as async]
   [clojure.edn :as edn]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as string]
   [clojure.zip :as zip]
   [docker]
   jsonrpc))

(set! *warn-on-reflection* true)

(defn heading-1-section? [loc]
  (= "atx_h1_marker" (-> loc (zip/next) (zip/node))))

(defn custom-range [s]
  (let [[_ l1 c1 l2 c2] (re-find #"(\d+):(\d+)-(\d+):(\d+)" s)]
    (->> [l1 c1 l2 c2] (map #(new Integer ^String %1)))))

(defn from-range [range content]
  (let [[l1 c1 l2 c2] (custom-range range)
        lines (->> (string/split content #"\n")
                   (drop (dec l1))
                   (take (inc (- l2 l1)))
                   (into []))]
    (string/join
     "\n"
     (-> lines
         (update 0 (fn [s] (.substring ^String s (dec c1))))
         (update (dec (count lines)) (fn [s] (.substring ^String s 0 (- c2 c1))))))))

(def prompt-pattern-with-role-capture #"(?i)\s*prompt\s+(\w+)\s?")
(def prompt-pattern #"(?i)\s*prompt\s?(\w+)?\s?")

(defn extract-role [s]
  (second
   (re-find prompt-pattern-with-role-capture s)))

;; headings that include the word Prompt
(defn prompt-section? [content node]
  (re-matches
   prompt-pattern
   (-> node (nth 2) (nth 3) (nth 1) (from-range content))))

(defn remove-first-line [s]
  (->> (string/split s #"\n")
       (drop 1)
       (string/join "\n")))

;; extract Role from Prompt ....
(defn node-content [content node]
  {:role
   (or (-> node (nth 2) (nth 3) (nth 1) (from-range content) (extract-role)) "user")
   :content
   (remove-first-line (from-range (nth node 1) content))})

(comment
  (extract-role "prompt user")
  (extract-role "prompt")
  (extract-role "prompt user and more")
  (re-matches prompt-pattern "prompt")
  (re-matches prompt-pattern "prompt user")
  (re-matches prompt-pattern "prompt user"))

(defn extract-prompts [content ast]
  (->>
   (iterate zip/next (zip/seq-zip ast))
   (take-while (complement zip/end?))
   (filter heading-1-section?)
   (map (comp zip/node zip/up zip/up))
   (filter (partial prompt-section? content))
   (map (partial node-content content))))

(defn metadata-section? [loc]
  (= "minus_metadata" (-> loc (zip/node) first)))

(defn remove-markers [s]
  (and s (when-let [[_ x] (re-find (re-pattern "(?sm).*---(.*)---.*") s)] x)))

(defn extract-metadata [content ast]
  (try
    (when-let [loc (->>
                    (iterate zip/next (zip/seq-zip ast))
                    (take-while (complement zip/end?))
                    (some (fn [loc] (when (metadata-section? loc) loc))))]
      (->
       (from-range (-> loc zip/node second) content)
       (remove-markers)
       (clj-yaml/parse-string)))
    (catch Throwable ex
      (jsonrpc/notify :error {:content "error parsing yaml in markdown preamble.  Metadata will be ignored."})
      nil)))

(defn html-comment? [loc]
  (and
   (= "html_block" (-> loc (zip/node) first))
   (= "-->" (-> loc (zip/children) last first))))

(defn extract-first-comment [content ast]
  (try
    (when-let [loc (->>
                     (iterate zip/next (zip/seq-zip ast))
                     (take-while (complement zip/end?))
                     (some (fn [loc] (when (html-comment? loc) loc))))]
      (->
        (from-range (-> loc zip/node second) content)
        (remove-markers)
        (clj-yaml/parse-string)))
    (catch Throwable ex
      (println ex)
      nil)))

(defn parse-new [content query]
  (let [content (str content "\n# END\n\n")
        x (docker/function-call-with-stdin
           {:image "vonwig/tree-sitter:latest"
            :content content
            :command (concat
                      ["-lang" "markdown"]
                      ["-query" query])})
        {s :pty-output} (async/<!! (async/thread
                                     (Thread/sleep 10)
                                     (docker/finish-call x)))]
    (->> s)))

(comment
  ; TODO - migrate to tree-sitter queries but can we express this with tree-sitter
  (parse-new (slurp "./tprompt1.md") "(document) @doc")
  (json/parse-string (parse-new (slurp "./tprompt1.md") "(document (minus_metadata) @doc)"))
  (json/parse-string (parse-new (slurp "./tprompt1.md") "(document (section (html_block) @html))"))
  (json/parse-string (parse-new (slurp "./tprompt1.md") "(document (section (atx_heading (atx_h1_marker)))* @top-section)")))

(defn parse-markdown
  "use the custom sexp representation"
  [content]
  (let [x (docker/function-call-with-stdin
           {:image "docker/lsp:treesitter"
            :content content})
        {s :pty-output} (async/<!! (async/thread
                                     (Thread/sleep 10)
                                     (docker/finish-call x)))]
    (->> (edn/read-string s))))

(defn parse-prompts
  "parse out the h1 prompt sections"
  [content]
  (let [content (str content "\n# END\n\n")
        ast (parse-markdown content)]
    {:messages
     (->> ast
          (extract-prompts content)
          (into []))
     :metadata  (or 
                 (extract-metadata content ast)
                 (extract-first-comment content ast)
                 {})}))

(comment
  (parse-prompts (slurp "./broken.md"))
  )

(comment
  ; inline same line !,[,],(,) in that order after filtering out other irrelevant things
  ; ^ those are imgages and the content between the [ ] should be put into a separate message
  ; the first minus_metadata block of the doc 
  ; the first html_block section that ends with --> 
  ;   get content and then check of --- --- pre-amble
  ;   then try to parse the yaml out of that
  (parse-markdown (slurp "./tprompt2.md"))
  (parse-prompts (slurp "./tprompt1.md"))
  (parse-prompts (slurp "./tprompt2.md"))
  )

(comment
  (string/split content #"\n")

  (def content (slurp "prompts/qrencode/README.md"))
  (pprint (parse-markdown content))

  (parse-markdown (slurp "prompts/pylint/docs.md"))
  (parse-markdown (slurp "prompts/pylint/4-run-violation-insert.md"))

  (def t
    '("section"
      "4:1-8:1"
      ("atx_heading"
       "4:1-5:1"
       ("atx_h1_marker" "4:1-4:2")
       ("inline" "4:3-4:13"))
      ("paragraph"
       "6:1-7:1"
       ("inline" "6:1-6:34" ("," "6:26-6:27") ("?" "6:33-6:34")))))

  (def r "4:3-4:13")
  (prompt-section? "" t)
  (from-range "4:3-4:13" content)
  (from-range "8:1-14:1" content))
