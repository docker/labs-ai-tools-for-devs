(ns volumes 
  (:require
   docker))

(defn with-volume
  "callback with the thread-id for this conversation, make sure the thread volume exists
   and possibly remove the volume afterwards"
  [f & {:keys [thread-id save-thread-volume]}]
  (let [thread-id (or thread-id (str (random-uuid)))]
    (try
      (docker/thread-volume {:Name thread-id})
      (f thread-id)
      (finally
        (when (not (true? save-thread-volume))
          (docker/delete-thread-volume {:Name thread-id}))))))
