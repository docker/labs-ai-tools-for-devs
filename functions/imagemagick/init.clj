(ns init
  (:require
   [babashka.process]
   [cheshire.core]))

(defn output [args]
  (try
    (->
      (apply babashka.process/process
             {:out :string}
             args)
      (deref)
      (babashka.process/check))
    (catch Throwable _ nil)))

(defn man [t]
  (output ["man" t]))
(defn help [t]
  (output [t "--help"]))
(defn h [t]
  (output [t "-h"]))

(try
  (let [[json-string & extra-args] *command-line-args*
        {:keys [args]} (cheshire.core/parse-string json-string true)]
    (println
     (-> (if (= "man" (first extra-args))
           (let [t (second args)] (or (man t) (help t) (h t)))
	   (-> (babashka.process/process
                {:out :string}
                (format "%s" args))
               (deref)
               (babashka.process/check)))
         (deref)
         (babashka.process/check)
         :out)))
  (catch Throwable t
    (binding [*out* *err*]
      (println (str "Error: " (.getMessage t)))
      (System/exit 1))))


