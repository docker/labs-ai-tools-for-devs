(ns init 
  (:require
   [clojure.spec.alpha :as s]))

;; validate initial thought
;; read in previous thought history
;; read in branches which are maps of named thought collections
;; 
;; return text message with current thought
;; 
(s/def ::thought string?)
(s/def ::thoughtNumber number?)
(s/def ::totalThoughts number?)
(s/def ::nextThoughtNeeded boolean?)
(s/def ::thought-data (s/keys :req-un [::thought ::thoughtNumber ::totalThoughts ::nextThoughtNeeded]))
