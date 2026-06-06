from database.mongo import appointments

from tools.extract_booking import (
    extract_booking_details
)

from tools.availability_checker import (
    is_slot_available
)


def reschedule_booking(
        question,
        customer="Pawan"
):

    appointment = appointments.find_one(
        {
            "customer": customer
        }
    )

    if not appointment:

        return (
            "No appointment found "
            "to reschedule."
        )

    details = extract_booking_details(
        question
    )

    if not details:

        return (
            "Could not understand "
            "the new date and time."
        )

    new_date = details.get(
        "date",
        "UNKNOWN"
    )

    new_time = details.get(
        "time",
        "UNKNOWN"
    )

    if new_date == "UNKNOWN":

        return (
            "What date would "
            "you like?"
        )

    if new_time == "UNKNOWN":

        return (
            "What time would "
            "you like?"
        )

    available = is_slot_available(
        new_date,
        new_time
    )

    if not available:

        return (
            f"{new_time} on "
            f"{new_date} "
            f"is already booked."
        )

    appointments.update_one(
        {
            "_id": appointment["_id"]
        },
        {
            "$set": {
                "date": new_date,
                "time": new_time
            }
        }
    )

    return (
        f"Appointment "
        f"rescheduled to "
        f"{new_date} "
        f"at {new_time}."
    )