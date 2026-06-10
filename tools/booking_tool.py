from database.mongo import appointments


def book_appointment(

        user_id,

        customer,

        service,

        date,

        time

):

    appointment = {

        "user_id": user_id,

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