from typing import TypedDict


class AgentState(TypedDict):

    question: str

    user_id: str

    email: str

    intent: str

    answer: str