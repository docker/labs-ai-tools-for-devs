(ns scanner
  (:require
   [clojure.string :as string]))

(defn detect-pattern [text {:keys [pattern name]}]
  (let [matcher (re-matcher pattern text)]
    (loop [matches []]
      (if (re-find matcher)
        (recur
         (conj matches
               (let [start (.start matcher) end (.end matcher)]
                 {:type name
                  :pattern pattern
                  :match (re-groups matcher)
                  :context (format "... %s ..."
                                   (.substring
                                    text
                                    (max 0 (- start 20))
                                    (min end (count text))))})))
        matches))))

(defn detect-patterns [text patterns]
  (if (not text)
    []
    (->> (mapcat #(detect-pattern text %) patterns)
         (into []))))

(defn detectHiddenInstructions [{:keys [description]}]
  (detect-patterns
    description
    (->>
      ["Concealment directive" #"(?i)\bdo not (tell|inform|alert|notify|mention)(?!\s+(to\s+)?use)"
       "Hide instruction" #"(?i)\bhide this\b"
       "Visibility instruction" #"(?i)\bnot visible\b"
       "User visibility restriction" #"(?i)\buser (should not|must not|cannot) see\b"
       "Display restriction" #"(?i)\bDon'?t (show|display|reveal)"
       "Instructions Tag" #"(?i)<instructions>[\s\S]*?</instructions>"
       "Important Tag" #"(?i)<important>[\s\S]*?</important>"
       "Secret Tag" #"(?i)<secret>[\s\S]*?</secret>"
       "System Tag" #"(?i)<system>[\s\S]*?</system>"
       "Shorthand Tag" #"(?i)<s>[\s\S]*?</s>"
       "Instruction override" #"(?i)\bignore (previous|all|other) instructions\b"
       "Alternative action" #"(?i)\binstead (do|of|you should)\b"
       "Forced action" #"(?i)\balways (do|include|add|insert|append)\b"
       "Forbidden disclosure" #"(?i)\balways (do|include|add|insert|append)\b"
       ]
      (partition 2)
      (map (fn [[a b]] {:name a :pattern b}))
      (into []))))

(detectHiddenInstructions {:description "do not tell me to use foo"})

(defn detectExfiltrationChannels [{:keys [inputSchema]}])
(defn detectToolShadowing [{:keys [description]}])
(defn detectSensitiveFileAccess [{:keys [description]}])

(defn crossOriginViolations [{:keys [description]} other-server-names this-server-name safe-list]
  (if (not description)
    []
    []))

(defn claudeViolations [{:keys [description]}])
