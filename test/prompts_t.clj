(ns prompts-t
  (:require
   [clojure.string :as string]
   [clojure.test :as t]
   [markdown]
   [prompts]))

(def not-nil? (comp not nil?))

(t/deftest prompt-patterns
  (t/are [x y] (x y)
    nil? (re-matches markdown/prompt-pattern "#prompt user ")
    not-nil? (re-matches markdown/prompt-pattern "prompt user ")
    not-nil? (re-matches markdown/prompt-pattern "Prompt user ")
    not-nil? (re-matches markdown/prompt-pattern "prompt")
    not-nil? (re-matches markdown/prompt-pattern "prompt user")
    nil? (re-matches markdown/prompt-pattern "xprompt user ")))

(t/deftest parse-h1-tests
  (->>
   [nil (markdown/parse-h1 "xprompt user")
    {:role "user" :title "title"} (markdown/parse-h1 "user Prompt title")
    {:role "user" :title "title"} (markdown/parse-h1 "user prompt title")
    {:role "user" :title "title"} (markdown/parse-h1 " prompt title")
    {:role "system" :title "prompt description"} (markdown/parse-h1 "system prompt prompt description")
    nil (markdown/parse-h1 "")
    nil (markdown/parse-h1 nil)
    {:role "user"} (markdown/parse-h1 "prompt")
    {:role "user"} (markdown/parse-h1 "user prompt")]
   (partition 2)
   (map (fn [[x y]] (t/is (= x y))))
   (doall)))

(t/deftest extract-prompts-tests
  (t/is
   (let [[m] (let [content (str (slurp "prompts/examples/curl.md") "\n# END\n\n")
                   ast (markdown/parse-markdown content)]
               (markdown/extract-prompts-with-descriptions content ast))]
     (and
      (= "user" (:role m))
      (string/starts-with? (:content m) "Run the curl"))))
  (t/is
   (let [[m]
         (let [content (str (slurp "prompts/examples/qrencode.md") "\n# END\n\n")
               ast (markdown/parse-markdown content)]
           (markdown/extract-prompts-with-descriptions content ast))]
     (and
      (= "user" (:role m))
      (string/starts-with? (:content m) "Generate a QR")
      (= "A description" (:description m))))))

