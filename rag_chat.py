from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile"
)

embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embedding
)

def get_answer(question):

    # Retrieve top 4 most relevant chunks
    docs = db.similarity_search(question, k=4)

    if not docs:
        return "I couldn't find any relevant information in my knowledge base."

    # Join the page content of the retrieved chunks
    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = f"""
You are a knowledgeable and helpful AI salon receptionist. 
You can answer questions related to the salon's Services, Pricing, Promotions, and Salon policies.
Answer ONLY using the provided context below. Do not make up information or hallucinate.
If the context does not contain the answer, politely state that you don't have that information.

Context:
{context}

Question:
{question}
"""

    response = llm.invoke(prompt)

    return response.content


if __name__ == "__main__":

    print("\nSalon Assistant Ready. Ask me about Services, Pricing, Promotions, or Policies.")
    while True:

        question = input("\nAsk: ")

        if question.lower() == "exit":
            break

        answer = get_answer(question)

        print("\nAnswer:")
        print(answer)