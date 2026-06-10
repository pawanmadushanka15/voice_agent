from database.session_manager import (
    get_session,
    update_session,
    clear_session
)

from tools.extract_booking import (
    extract_booking_details
)

from tools.booking_tool import (
    book_appointment
)

from tools.availability_checker import (
    is_slot_available,
    get_available_slots
)


def conversational_book(
        question,
        user_id,
        email
):

    details = extract_booking_details(
        question
    )

    print(
        "Extracted:",
        details
    )

    if not details:

        return (
            "Could not understand "
            "the booking request."
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

    session = get_session(
        user_id
    )

    if service != "UNKNOWN":

        update_session(
            user_id,
            {
                "service": service
            }
        )

    if date != "UNKNOWN":

        update_session(
            user_id,
            {
                "date": date
            }
        )

    if time != "UNKNOWN":

        update_session(
            user_id,
            {
                "time": time
            }
        )

    session = get_session(
        user_id
    )

    if not session["service"]:

        return (
            "What service would you like?"
        )

    if not session["date"]:

        return (
            "What date would you like?"
        )

    if not session["time"]:

        return (
            "What time would you like?"
        )

    available = is_slot_available(
        session["date"],
        session["time"]
    )

    if not available:

        slots = get_available_slots(
            session["date"]
        )

        clear_session(
            user_id
        )

        if slots:

            return (
                f"Sorry, "
                f"{session['time']} "
                f"is already booked.\n\n"
                f"Available times:\n"
                f"{', '.join(slots)}"
            )

        return (
            "Sorry, no available "
            "slots for that day."
        )

    result = book_appointment(

        user_id=user_id,

        customer=email,

        service=session["service"],

        date=session["date"],

        time=session["time"]

    )

    clear_session(
        user_id
    )

    return result