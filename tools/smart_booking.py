from tools.extract_booking import extract_booking_details
from tools.booking_tool import book_appointment


def smart_book(question):

    details = extract_booking_details(
        question
    )

    print("Extracted Details:", details)

    if not details:

        return (
            "Could not extract booking details."
        )

    service = details.get(
        "service",
        "UNKNOWN"
    )

    date = details.get(
        "date",
        "UNKNOWN"
    )

    time = details.get(
        "time",
        "UNKNOWN"
    )

    if service == "UNKNOWN":

        return (
            "What service would you like to book?"
        )

    if date == "UNKNOWN":

        return (
            "What date would you like?"
        )

    if time == "UNKNOWN":

        return (
            "What time would you like?"
        )

    result = book_appointment(
        customer="Pawan",
        service=service,
        date=date,
        time=time
    )

    return result