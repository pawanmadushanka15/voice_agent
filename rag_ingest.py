import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Create knowledge_base folder if it doesn't exist
os.makedirs("knowledge_base", exist_ok=True)

# Check if there are PDFs in the folder
if not any(f.endswith(".pdf") for f in os.listdir("knowledge_base")):
    print("Please place PDF files in the 'knowledge_base' directory and run again.")
    exit(0)

# Load all PDFs from knowledge_base
loader = PyPDFDirectoryLoader("knowledge_base")
documents = loader.load()

# Split documents into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
docs = splitter.split_documents(documents)

# Initialize embeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Store in ChromaDB
db = Chroma.from_documents(
    docs,
    embedding,
    persist_directory="./chroma_db"
)

print(f"Knowledge Base successfully created with {len(docs)} chunks from {len(documents)} document pages.")