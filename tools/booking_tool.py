from database.mongo import appointments


def book_appointment(
        customer,
        service,
        date,
        time
):
    appointment = {
        "customer": customer,
        "service": service,
        "date": date,
        "time": time
    }

    appointments.insert_one(
        appointment
    )

    return (
        f"Appointment booked for "
        f"{customer} on "
        f"{date} at {time}"
    )

def cancel_appointment(
        customer
):

    result = appointments.delete_one(
        {
            "customer": customer
        }
    )

    if result.deleted_count > 0:
        return (
            "Appointment cancelled."
        )

    return (
        "No appointment found."
    )