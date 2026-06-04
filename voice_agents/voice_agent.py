from langgraph.graph import StateGraph, END

from voice_agents.state import AgentState
from voice_agents.intent_classifier import classify_intent

from agent import llm
from tools.booking_tool import book_appointment
from rag_chat import get_answer


# -----------------------------
# Intent Detection Node
# -----------------------------
def intent_node(state):

    question = state["question"]

    intent = classify_intent(question)

    return {
        "intent": intent
    }


# -----------------------------
# Booking Node
# -----------------------------
def booking_node(state):

    result = book_appointment(
        customer="Pawan",
        service="Haircut",
        date="2026-06-15",
        time="3 PM"
    )

    return {
        "answer": result
    }


# -----------------------------
# FAQ / RAG Node
# -----------------------------
def faq_node(state):

    answer = get_answer(
        state["question"]
    )

    return {
        "answer": answer
    }


# -----------------------------
# General Chat Node
# -----------------------------
def chat_node(state):

    response = llm.invoke(
        state["question"]
    )

    return {
        "answer": response.content
    }


# -----------------------------
# Router
# -----------------------------
def route_intent(state):

    return state["intent"]


# -----------------------------
# Build Graph
# -----------------------------
graph = StateGraph(AgentState)

graph.add_node(
    "intent",
    intent_node
)

graph.add_node(
    "booking",
    booking_node
)

graph.add_node(
    "faq",
    faq_node
)

graph.add_node(
    "chat",
    chat_node
)

# Entry Point
graph.set_entry_point("intent")

# Routing Logic
graph.add_conditional_edges(
    "intent",
    route_intent,
    {
        "BOOKING": "booking",
        "FAQ": "faq",
        "GENERAL": "chat"
    }
)

# End Nodes
graph.add_edge("booking", END)
graph.add_edge("faq", END)
graph.add_edge("chat", END)

# Compile Graph
app = graph.compile()


# -----------------------------
# Main Loop
# -----------------------------
if __name__ == "__main__":

    print("\nVoice Agent Started")
    print("Type 'exit' to quit.\n")

    while True:

        question = input("Ask: ")

        if question.lower() == "exit":
            print("Goodbye!")
            break

        result = app.invoke(
            {
                "question": question,
                "intent": "",
                "answer": ""
            }
        )

        print("\nAnswer:")
        print(result["answer"])
        print()