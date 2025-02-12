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

(defn description-section? [content node]
  (when-let [atx-header-node (first (filter #(= "atx_heading" (first %)) node))]
    (println "trimmed " (string/trim (from-range (-> atx-header-node (nth 3) (nth 1)) content)))
    (= "description"  (string/trim (from-range (-> atx-header-node (nth 3) (nth 1)) content)))))

(defn atx-heading-section? [node]
  (= "atx_heading" (first node)))

(defn remove-section-content [content s node]
  (if (and (list? node) (= "atx_heading" (first node)))
    (string/replace s (from-range (nth node 1) content) "")
    s))

(defn section-content-without-headings [content node]
  (reduce
   (partial remove-section-content content)
   (from-range (nth node 1) content)
   (seq node)))

(defn h1-prompt-content [content node]
  (merge
   (-> node (nth 2) (nth 3) (nth 1) (from-range content) (parse-h1))
    ;; TODO merge a description and filter node content
   (if (some section? node)
     (merge
      {:content (->> node
                     (filter section?)
                     (filter (complement (partial description-section? content)))
                     #_(filter (complement atx-heading-section?))
                     (map (partial section-content-without-headings content))
                     (apply str)
                     (string/trim))}
      (when-let [description (->> node
                                  (filter section?)
                                  (filter (partial description-section? content))
                                  first
                                  (section-content-without-headings content)
                                  (string/trim))]
        {:description description}))
     {:content (string/trim (section-content-without-headings content node))})))

(def heading-1-loc->top-level-section-node (comp zip/node zip/up zip/up))

(defn extract-prompts-with-descriptions [content ast]
  (->>
   (iterate zip/next (zip/seq-zip ast))
   (take-while (complement zip/end?))
   (filter heading-1-section?)
   (map heading-1-loc->top-level-section-node)
   (filter (partial prompt-section? content))
   (map (partial h1-prompt-content content))))

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
        ast (parse-markdown content)]
    {:messages
     (->> ast
          (extract-prompts-with-descriptions content)
          (into []))
     :metadata  (or
                 (extract-metadata content ast)
                 (extract-first-comment content ast)
                 {})}))

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

