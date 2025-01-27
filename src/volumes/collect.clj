
(comment
  "pass in args"
  (def args {:directory "/Users/slim"}))

(require '[clojure.java.io :as io])
(require '[babashka.fs :as fs])
(require '[cheshire.core :as json])

(defn file->bytes [path]
  (with-open [in (io/input-stream path)
              out (java.io.ByteArrayOutputStream.)]
    (io/copy in out)
    (.toByteArray out)))

(defn encode [bytes]
  (let [encoder (java.util.Base64/getEncoder)
        resultBytes (.encode encoder bytes)]
    (String. resultBytes)))

(defn mcp-resource
  "returns a mcp resource"
  [file]
  {:type "resource"
   :resource
   (merge
     {:uri (str "resource://" (fs/path file))
      :mimeType (case (fs/extension file)
                  "png" "image/png"
                  "txt" "text/plain")}
     (case (fs/extension file)
                  "png" {:blob ((comp encode file->bytes) file)}
                  "txt" {:text (slurp file)}))})

(json/generate-string
  (->>
    (let [{:keys [directory]} args]
      (fs/list-dir directory))
    (map fs/file)
    (filter #(and (.isFile %) (#{"png" "txt"} (fs/extension %))))
    (map mcp-resource)
    (into [])) 
  keyword)
