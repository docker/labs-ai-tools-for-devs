#!/usr/bin/env python

import sys
import json
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

# Initialize OpenAI embeddings
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
)

# Load the existing Chroma vector store
vector_store = Chroma(
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)

# Perform similarity search
results = vector_store.similarity_search_with_score(sys.argv[1], k=10)

# Transform results to JSON and write to stdout
results_json = []
for document, score in results:
    results_json.append({
        "content": document.page_content,
        "metadata": document.metadata,
        "similarity_score": score
    })

json.dump(results_json, sys.stdout, indent=2)
