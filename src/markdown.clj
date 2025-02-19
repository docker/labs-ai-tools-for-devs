(ns markdown
  (:require
   [cheshire.core :as json]
   [clj-yaml.core :as clj-yaml]
   [clojure.core.async :as async]
   [clojure.edn :as edn]
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

(defn parse-h1 [s]
  (when s
    (let [[t1 t2 & tokens :as h1] (string/split (string/trim s) #"\s+")]
      (cond
        ;; prompt is the first token
        (and t1 (= "prompt" (string/lower-case t1)))
        (merge
         {:role (or (#{"user" "system"} t2) "user")}
         (let [v (concat (if (#{"user" "system"} t2) [] (when t2 [t2])) tokens)]
           (when (seq v)
             {:title (string/join " " v)})))

        ;; prompt is the second token
        (and t2 (= "prompt" (string/lower-case t2)))
        (merge
         {:role t1}
         (when (seq tokens) {:title (string/join " " tokens)}))))))

(def prompt-pattern-with-role-capture #"(?i)\s*prompt\s+(\w+)\s?")
(def prompt-pattern #"(?i)\s*prompt\s?(\w+)?\s?")

(defn extract-role [s]
  (:role (parse-h1 s)))

;; headings that include the word Prompt
(defn prompt-section? [content node]
  (parse-h1 (-> node (nth 2) (nth 3) (nth 1) (from-range content))))

(defn remove-first-line [s]
  (->> (string/split s #"\n")
       (drop 1)
       (string/join "\n")))

;; extract Role from Prompt ....
(defn node-content [content node]
  (merge
   (-> node (nth 2) (nth 3) (nth 1) (from-range content) (parse-h1))
    ;; TODO merge a description and filter node content
   {:content
    (remove-first-line (from-range (nth node 1) content))}))

(defn section? [node]
  (and (list? node) (= "section" (first node))))

(defn fenced-code-block? [node]
  (and (list? node) (= "fenced_code_block" (first node))))

(defn description-section? [content node]
  (when-let [atx-header-node (first (filter #(= "atx_heading" (first %)) node))]
    (= "description"  (string/trim (from-range (-> atx-header-node (nth 3) (nth 1)) content)))))

(defn atx-heading-section? [node]
  (= "atx_heading" (first node)))

(defn atx-heading-1? [node]
  (and
   (= "atx_heading" (first node))
   (= "atx_h1_marker" (-> node (nth 2) first))))

(defn remove-section-content [content s node]
  (if (and (list? node) (= "atx_heading" (first node)))
    (string/replace s (from-range (nth node 1) content) "")
    s))

(defn section-content-without-headings [content node]
  (reduce
   (partial remove-section-content content)
   (from-range (nth node 1) content)
   (seq node)))

(defn section-content [content node]
  (from-range (nth node 1) content))

(defn h1-prompt-content
  " params
      node is a top-level h1 prompt node"
  [content node]
  (merge
   (-> node (nth 2) (nth 3) (nth 1) (from-range content) (parse-h1))
   (if (->> node
            (filter list?)
            (some (partial description-section? content)))
     ;; prompt is broken up with real sections
     (merge
      {:content (let [top-level-content-nodes
                      (->> node
                           (filter list?)
                           (filter (complement (partial description-section? content)))
                           (filter (complement atx-heading-1?)))
                      first-heading-node
                      (->> top-level-content-nodes
                           (filter section?)
                           first
                           (seq)
                           (filter atx-heading-section?)
                           first)
                      prompt-content
                      (->> top-level-content-nodes
                           (map (partial section-content content))
                           (apply str))]
                  (string/trim
                    (string/replace 
                      prompt-content  
                      (if first-heading-node
                        (from-range (nth first-heading-node 1) content)
                        "")
                      "")))}
      (when-let [description (some->> node
                                      (filter section?)
                                      (filter (partial description-section? content))
                                      first
                                      (section-content-without-headings content)
                                      (string/trim))]
        {:description description}))
     ;; the contene is just one big section with no description
     {:content (string/trim (section-content-without-headings content node))})))

(def heading-1-loc->top-level-section-node (comp zip/node zip/up zip/up))

(defn extract-prompts-with-descriptions [content metadata ast]
  (->>
   (iterate zip/next (zip/seq-zip ast))
   (take-while (complement zip/end?))
   (filter heading-1-section?)
   (map heading-1-loc->top-level-section-node)
   (filter (partial prompt-section? content))
   (map (partial h1-prompt-content content))
   (map (fn [m] (-> m
                    (assoc :name (cond
                                   (and (:title m) (:name metadata)) (str (:name metadata) ":" (:title m))
                                   (:title m) (:title m)
                                   (:name metadata) (:name metadata)
                                   ;; TODO fix this
                                   :else "missing name")
                           :description (or
                                         (:description m)
                                         (:description metadata)
                                         "missing description")))))))

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

(defn extract-first-yaml-code-block [content ast]
  (try
    (when-let [loc (when-let [first-section
                              (->>
                               (iterate zip/right (zip/down (zip/seq-zip ast)))
                               (some (fn [loc] (when (section? (zip/node loc)) loc))))]
                     (when-let [first-code-block
                                (->>
                                 (iterate zip/right (zip/down first-section))
                                 (some (fn [loc] (when (fenced-code-block? (zip/node loc)) loc))))]
                       first-code-block))]
      (->
       (from-range (-> loc zip/node (nth 5) (nth 1)) content)
       (clj-yaml/parse-string)))
    (catch Throwable ex
      (println ex)
      nil)))

(comment
  (let [content (slurp "prompts/examples/github_issues.md")]
    (extract-first-yaml-code-block content (parse-markdown content))))

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
  "parse out the h1 prompt sections and the metadata"
  [content]
  (let [content (str content "\n# END\n\n")
        ast (parse-markdown content)
        metadata (or
                  (extract-metadata content ast)
                  (extract-first-comment content ast)
                  (extract-first-yaml-code-block content ast)
                  {})]
    {:messages
     (->> ast
          (extract-prompts-with-descriptions content metadata)
          (into []))
     :metadata  metadata}))

;; ---------- future ---------

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

