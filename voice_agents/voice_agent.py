from langgraph.graph import StateGraph, END

from voice_agents.state import AgentState
from voice_agents.intent_classifier import classify_intent

from agent import llm
from rag_chat import get_answer

from tools.conversational_booking import conversational_book


# ==========================
# Intent Node
# ==========================
def intent_node(state):

    question = state["question"]

    intent = classify_intent(
        question
    )

    return {
        "intent": intent
    }


# ==========================
# Booking Node
# ==========================
def booking_node(state):

    result = conversational_book(
        state["question"]
    )

    return {
        "answer": result
    }


# ==========================
# FAQ Node (RAG)
# ==========================
def faq_node(state):

    answer = get_answer(
        state["question"]
    )

    return {
        "answer": answer
    }


# ==========================
# General Chat Node
# ==========================
def chat_node(state):

    response = llm.invoke(
        state["question"]
    )

    return {
        "answer": response.content
    }


# ==========================
# Router
# ==========================
def route_intent(state):

    return state["intent"]


# ==========================
# Build Graph
# ==========================
graph = StateGraph(
    AgentState
)

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

graph.set_entry_point(
    "intent"
)

graph.add_conditional_edges(
    "intent",
    route_intent,
    {
        "BOOKING": "booking",
        "FAQ": "faq",
        "GENERAL": "chat"
    }
)

graph.add_edge(
    "booking",
    END
)

graph.add_edge(
    "faq",
    END
)

graph.add_edge(
    "chat",
    END
)

app = graph.compile()


# ==========================
# Terminal Testing
# ==========================
if __name__ == "__main__":

    print("\nVoice Agent Started")
    print("Type 'exit' to quit.")

    while True:

        question = input(
            "\nAsk: "
        )

        if question.lower() == "exit":
            break

        result = app.invoke(
            {
                "question": question,
                "intent": "",
                "answer": ""
            }
        )

        print(
            "\nAnswer:"
        )

        print(
            result["answer"]
        )