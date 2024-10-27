import json
import sys
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma 

# Initialize OpenAI embeddings
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
)

# Create Chroma vector store
vector_store = Chroma(
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)

# Read JSON from command line argument
if len(sys.argv) < 2:
    print("Please provide a JSON string as a command line argument.")
    sys.exit(1)

json_input = json.loads(sys.argv[1])

# Create document from JSON input
doc1 = Document(
    page_content=json_input['page_content'],
    metadata=json_input['metadata']
)

# Add document to the vector store
ids = vector_store.add_documents([doc1])

print(f"{ids[0]}")
