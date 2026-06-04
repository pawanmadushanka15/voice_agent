from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

llm = ChatGroq(
    model="openai/gpt-oss-120b"
)

embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embedding
)


def get_answer(question):

    docs = db.similarity_search(question)

    if not docs:
        return "No relevant information found."

    context = docs[0].page_content

    prompt = f"""
Answer only using the provided context.

Context:
{context}

Question:
{question}
"""

    response = llm.invoke(prompt)

    return response.content


if __name__ == "__main__":

    while True:

        question = input("\nAsk: ")

        if question.lower() == "exit":
            break

        answer = get_answer(question)

        print("\nAnswer:")
        print(answer)