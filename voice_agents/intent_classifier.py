def classify_intent(question):

    question = question.lower()

    if (
        "cancel" in question
        or "delete" in question
        or "remove" in question
    ):
        return "CANCEL"

    if (
        "reschedule" in question
        or "change appointment" in question
        or "move appointment" in question
        or "change booking" in question
    ):
        return "RESCHEDULE"

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