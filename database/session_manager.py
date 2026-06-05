from database.mongo import db

sessions = db.sessions


def get_session(user_id):

    session = sessions.find_one(
        {
            "user_id": user_id
        }
    )

    if not session:

        session = {

            "user_id": user_id,

            "service": None,
            "date": None,
            "time": None

        }

        sessions.insert_one(
            session
        )

        session = sessions.find_one(
            {
                "user_id": user_id
            }
        )

    return session


def update_session(
        user_id,
        data
):

    sessions.update_one(
        {
            "user_id": user_id
        },
        {
            "$set": data
        }
    )


def clear_session(user_id):

    sessions.delete_one(
        {
            "user_id": user_id
        }
    )