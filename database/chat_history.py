from datetime import datetime

from database.conversations import conversations


def save_conversation(
        question,
        answer
):

    conversations.insert_one(
        {
            "question": question,
            "answer": answer,
            "created_at":
                datetime.utcnow()
        }
    )

def get_conversations():
        results = []

        for doc in conversations.find():
            doc["_id"] = str(
                doc["_id"]
            )

            results.append(doc)

        return results