(ns prompts-t
  (:require
   [babashka.fs :as fs]
   [clojure.string :as string]
   [clojure.test :as t]
   [markdown]
   [markdown :as markdown-parser]
   [pogonos.core :as stache]
   [prompts :refer [get-prompts]]
   repl))

(def not-nil? (comp not nil?))

(t/deftest prompt-patterns
  (t/are [x y] (x y)
    nil? (re-matches markdown-parser/prompt-pattern "#prompt user ")
    not-nil? (re-matches markdown-parser/prompt-pattern "prompt user ")
    not-nil? (re-matches markdown-parser/prompt-pattern "Prompt user ")
    not-nil? (re-matches markdown-parser/prompt-pattern "prompt")
    not-nil? (re-matches markdown-parser/prompt-pattern "prompt user")
    nil? (re-matches markdown-parser/prompt-pattern "xprompt user ")))

(t/deftest parse-h1-tests
  (->>
   [nil (markdown-parser/parse-h1 "xprompt user")
    {:role "user" :title "title"} (markdown-parser/parse-h1 "user Prompt title")
    {:role "user" :title "title"} (markdown-parser/parse-h1 "user prompt title")
    {:role "user" :title "title"} (markdown-parser/parse-h1 " prompt title")
    {:role "system" :title "prompt description"} (markdown-parser/parse-h1 "system prompt prompt description")
    nil (markdown-parser/parse-h1 "")
    nil (markdown-parser/parse-h1 nil)
    {:role "user"} (markdown-parser/parse-h1 "prompt")
    {:role "user"} (markdown-parser/parse-h1 "user prompt")]
   (partition 2)
   (map (fn [[x y]] (t/is (= x y))))
   (doall)))

(t/deftest extract-prompts-tests
  (t/is
   (let [[m] (let [content (str (slurp "prompts/examples/hello_world.md") "\n# END\n\n")
                   ast (markdown-parser/parse-markdown content)]
               (markdown-parser/extract-prompts-with-descriptions content {:name "test"} ast))]
     (and
      (= "test" (:name m))
      (= "user" (:role m))
      (string/starts-with? (:content m) "Ask what kind")))
   "hello_world prompt")
  (t/is
   (let [[m] (let [content (str (slurp "prompts/examples/curl.md") "\n# END\n\n")
                   ast (markdown-parser/parse-markdown content)]
               (markdown-parser/extract-prompts-with-descriptions content {:name "test"} ast))]
     (and
      (= "test:fetch gists" (:name m))
      (= "user" (:role m))
      (string/starts-with? (:content m) "Run the curl")))
   "curl prompt")
  (t/is
   (let [[m] (let [content (str (slurp "prompts/examples/qrencode.md") "\n# END\n\n")
                   ast (markdown-parser/parse-markdown content)]
               (markdown-parser/extract-prompts-with-descriptions content {:name "qrencode"} ast))]
     (and
      (= "user" (:role m))
      (= "qrencode" (:name m))
      (string/starts-with? (:content m) "Generate a QR")
      (string/starts-with? (:description m) "Generate")))
   "qrencode prompt")
  (t/is
   (let [[m] (let [content (str (slurp "prompts/chrome.md") "\n# END\n\n")
                   ast (markdown-parser/parse-markdown content)]
               (markdown-parser/extract-prompts-with-descriptions content {:name "qrencode"} ast))]
     (and
      (= "user" (:role m))
      (= "qrencode" (:name m))
      (string/starts-with? (:content m) "You are a")))
   "chrome prompt"))

(comment
  (prompts/get-prompts {:prompts "prompts/examples/curl.md"})
  (prompts/get-prompts {:prompts "prompts/mcp/github-official.md"}))

(comment
  (let [content (str (slurp "prompts/chrome.md") "\n# END\n\n")
        ast (markdown-parser/parse-markdown content)]
    (markdown-parser/extract-prompts-with-descriptions content {:name "test"} ast)))

(comment
  (repl/setup-stdout-logger)
  (get-prompts {:prompts (fs/file "./prompts/examples/curl.md")})
  (get-prompts {:prompts (fs/file "./prompts/examples/generate-dockerfile.md")})
  (get-prompts {:prompts (fs/file "./README.md")})
  (get-prompts {:prompts (fs/file "./prompts/mcp/postgres.md")})
  (get-prompts {:prompts (fs/file "./prompts/mcp/postgresql.md")})
  (=
   ((:prompt-function (get-prompts {:prompts (fs/file "./prompts/examples/qrencode.md")})) {:content "mycontent"})
   [{:role "user",
     :content
     {:text
      "\nGenerate a QR code for the content 'mycontent'.\nSave the generated image to `/thread/resources/qrcode.png`.\nIf the command fails, read the man page and try again.\nIf successful, output the path to the generated image in markdown syntax.",
      :type "text"}}]))

(comment
  (markdown-parser/parse-prompts (slurp "prompts/mcp/stripe.md"))
  (get-prompts {:prompts (fs/file "./prompts/mcp/stripe.md")}))

(comment
  (stache/render-string "yo {{a.0.content}}" {:a [{:content "blah"}]}))
