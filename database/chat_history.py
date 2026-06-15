from datetime import datetime

from database.conversations import conversations


def save_conversation(
        question,
        answer,
        user_id="anonymous",
        email="anonymous@example.com"
):

    conversations.insert_one(
        {
            "question": question,
            "answer": answer,
            "user_id": user_id,
            "email": email,
            "created_at":
                datetime.utcnow()
        }
    )

def get_conversations(user_id="anonymous"):
        results = []

        for doc in conversations.find({"user_id": user_id}):
            doc["_id"] = str(
                doc["_id"]
            )

            results.append(doc)

        return results