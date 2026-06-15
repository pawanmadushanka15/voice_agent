from langgraph.graph import StateGraph, END

from voice_agents.state import AgentState
from voice_agents.intent_classifier import classify_intent

from agent import llm
from rag_chat import get_answer

from tools.conversational_booking import (
    conversational_book
)

from tools.cancel_booking import (
    cancel_booking
)

from tools.reschedule_booking import (
    reschedule_booking
)


def intent_node(state):

    question = state["question"]

    intent = classify_intent(
        question,
        state["user_id"]
    )

    return {
        "intent": intent
    }


def booking_node(state):

    result = conversational_book(
        state["question"],
        state["user_id"],
        state["email"]
    )

    return {
        "answer": result
    }


def cancel_node(state):

    result = cancel_booking()

    return {
        "answer": result
    }


def reschedule_node(state):

    result = reschedule_booking(
        state["question"]
    )

    return {
        "answer": result
    }


def faq_node(state):

    answer = get_answer(
        state["question"]
    )

    return {
        "answer": answer
    }


def chat_node(state):

    response = llm.invoke(
        state["question"]
    )

    return {
        "answer": response.content
    }


def route_intent(state):

    return state["intent"]


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
    "cancel",
    cancel_node
)

graph.add_node(
    "reschedule",
    reschedule_node
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
        "CANCEL": "cancel",
        "RESCHEDULE": "reschedule",
        "FAQ": "faq",
        "GENERAL": "chat"
    }
)

graph.add_edge(
    "booking",
    END
)

graph.add_edge(
    "cancel",
    END
)

graph.add_edge(
    "reschedule",
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
                "user_id": "terminal_user",
                "email": "terminal@example.com",
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