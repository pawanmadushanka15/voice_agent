from database.mongo import appointments


def get_all_appointments():

    results = []

    for doc in appointments.find():

        doc["_id"] = str(
            doc["_id"]
        )

        results.append(doc)

    return results