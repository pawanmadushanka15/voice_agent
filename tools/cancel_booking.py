from database.mongo import appointments


def cancel_booking(customer="Pawan"):

    appointment = appointments.find_one(
        {
            "customer": customer
        }
    )

    if not appointment:

        return (
            "No appointment found "
            "to cancel."
        )

    appointments.delete_one(
        {
            "_id": appointment["_id"]
        }
    )

    return (
        "Your appointment "
        "has been cancelled."
    )