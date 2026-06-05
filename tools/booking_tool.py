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
        f"{customer} "
        f"for {service} "
        f"on {date} "
        f"at {time}"
    )