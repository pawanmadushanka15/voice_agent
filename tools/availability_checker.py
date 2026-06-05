from database.mongo import appointments


def is_slot_available(
        date,
        time
):

    existing = appointments.find_one(
        {
            "date": date,
            "time": time
        }
    )

    return existing is None


def get_available_slots(date):

    all_slots = [

        "9 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
        "5 PM",
        "6 PM"

    ]

    booked = appointments.find(
        {
            "date": date
        }
    )

    booked_times = [
        item["time"]
        for item in booked
    ]

    available = [

        slot

        for slot in all_slots

        if slot not in booked_times

    ]

    return available