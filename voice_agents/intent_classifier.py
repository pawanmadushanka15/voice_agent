def classify_intent(question):

    question = question.lower()

    if (
        "book" in question
        or "appointment" in question
    ):
        return "BOOKING"

    if (
        "price" in question
        or "hours" in question
        or "haircut" in question
    ):
        return "FAQ"

    return "GENERAL"