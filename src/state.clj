(ns state)

(defn each [& fs]
  (fn [coll]
    (->> coll
         (map #(reduce (fn [m f] (f m)) %1 fs)))))

(defn summarize-arguments [m]
  (update-in m [:function :arguments] (fn [s] (format "... json length %d ..." (count s)))))
(defn summarize-content [m]
  (update m :content (fn [c] (format "... %d characters ..." (count c)))))
(defn summarize-tool-calls [m]
  (update-in m [:tool_calls] (each summarize-arguments)))

(defn summarize [state]
  (-> state
      (update :messages (each summarize-content summarize-tool-calls))))

