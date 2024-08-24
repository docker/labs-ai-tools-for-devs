(ns markdown
  (:require
   [clojure.core.async :as async]
   [clojure.edn :as edn]
   [clojure.pprint :refer [pprint]]
   [clojure.string :as string]
   [clojure.zip :as zip]
   [docker]))

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
         (update 0 (fn [s] (.substring s (dec c1))))
         (update (dec (count lines)) (fn [s] (.substring s 0 (- c2 c1))))))))

;; headings that include the word Prompt
(defn prompt-section? [content node]
  (string/includes?
   (-> node (nth 2) (nth 3) (nth 1) (from-range content))
   "Prompt"))

(defn extract-role [s]
  (-> s (string/replace "Prompt" "") (string/trim)))

(defn remove-first-line [s]
  (->> (string/split s #"\n")
       (drop 1)
       (string/join "\n")))

;; extract Role from Prompt ....
(defn node-content [content node]
  {:role
   (-> node (nth 2) (nth 3) (nth 1) (from-range content) (extract-role))
   :content
   (remove-first-line (from-range (nth node 1) content))} )

(defn extract-prompts [content ast]
  (->>
   (iterate zip/next (zip/seq-zip ast))
   (take-while (complement zip/end?))
   (filter heading-1-section?)
   (map (comp zip/node zip/up zip/up))
   (filter (partial prompt-section? content))
   (map (partial node-content content))
   (pprint)))

(defn parse-markdown [content]
  (let [x (docker/function-call-with-stdin
           {:image "docker/lsp:treesitter"
            :content content})
        {s :pty-output} (async/<! (async/thread
                                    (Thread/sleep 10)
                                    (docker/finish-call x)))]
    (->> s
         (edn/read-string)
         (extract-prompts content))))

(comment

  (def content (slurp "test.md"))
  (pprint (parse-markdown content))

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
