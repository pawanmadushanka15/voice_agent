from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from voice_agents.voice_agent import app as agent_app

from fastapi import UploadFile, File
import shutil
import os

from speech.stt import speech_to_text
from fastapi.responses import FileResponse
from speech.tts import text_to_speech

from database.chat_history import (
    save_conversation
)

from database.chat_history import (
    get_conversations
)

from bson import ObjectId

from database.mongo import appointments

from database.appointments import (
    get_all_appointments
)

from database.conversations import (
    conversations
)

api = FastAPI()

import os as _os
_FRONTEND_URL = _os.getenv("FRONTEND_URL", "")

_allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if _FRONTEND_URL:
    for _u in _FRONTEND_URL.split(","):
        _cleaned = _u.strip().rstrip("/")
        if _cleaned and _cleaned not in _allowed_origins:
            _allowed_origins.append(_cleaned)
else:
    _allowed_origins = ["*"]

api.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@api.get("/")
def health_check():
    return {"status": "ok", "message": "Voice Agent API is running"}


class ChatRequest(BaseModel):

    question: str

    user_id: str

    email: str


class AppointmentUpdate(BaseModel):

    customer: str

    service: str

    date: str

    time: str


@api.post("/chat")
def chat(request: ChatRequest):

    result = agent_app.invoke(
        {

            "question":
                request.question,

            "user_id":
                request.user_id,

            "email":
                request.email,

            "intent": "",

            "answer": ""

        }
    )

    save_conversation(
        request.question,
        result["answer"],
        request.user_id,
        request.email
    )

    return {
        "answer":
            result["answer"]
    }


@api.post("/speech-to-text")
async def transcribe_audio(
        file: UploadFile = File(...)
):

    os.makedirs(
        "audio_uploads",
        exist_ok=True
    )

    file_path = (
        f"audio_uploads/"
        f"{file.filename}"
    )

    with open(
            file_path,
            "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    transcript = speech_to_text(
        file_path
    )

    return {
        "transcript":
            transcript
    }


@api.post("/text-to-speech")
def generate_speech(
        request: ChatRequest
):

    audio_path = text_to_speech(
        request.question
    )

    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename="response.mp3"
    )


@api.get("/conversations")
def conversation_history(user_id: str = "anonymous"):

    return get_conversations(user_id)


@api.delete("/conversations")
def clear_history(user_id: str = "anonymous"):

    conversations.delete_many(
        {"user_id": user_id}
    )

    return {
        "message":
            "History cleared"
    }


# ==========================
# Admin Dashboard APIs
# ==========================

@api.get("/appointments")
def all_appointments():

    return get_all_appointments()


@api.delete(
    "/appointments/{appointment_id}"
)
def delete_appointment(
        appointment_id: str
):

    appointments.delete_one(
        {
            "_id":
                ObjectId(
                    appointment_id
                )
        }
    )

    return {
        "message":
            "Appointment deleted"
    }


@api.put(
    "/appointments/{appointment_id}"
)
def update_appointment(

        appointment_id: str,

        appointment:
        AppointmentUpdate

):

    appointments.update_one(
        {
            "_id":
                ObjectId(
                    appointment_id
                )
        },
        {
            "$set": {

                "customer":
                    appointment.customer,

                "service":
                    appointment.service,

                "date":
                    appointment.date,

                "time":
                    appointment.time

            }
        }
    )

    return {
        "message":
            "Appointment updated"
    }


@api.get("/dashboard-stats")
def dashboard_stats():

    total = (
        appointments.count_documents(
            {}
        )
    )

    haircut_count = (
        appointments.count_documents(
            {
                "service":
                    "Haircut"
            }
        )
    )

    return {

        "totalAppointments":
            total,

        "haircuts":
            haircut_count

    }

@api.get("/analytics/total")
def analytics_total():
    total = appointments.count_documents({})
    return {"total": total}

@api.get("/analytics/services")
def analytics_services():
    pipeline = [
        {"$group": {"_id": "$service", "count": {"$sum": 1}}}
    ]
    result = list(appointments.aggregate(pipeline))
    formatted_result = [{"service": item["_id"], "count": item["count"]} for item in result]
    return formatted_result

@api.get("/analytics/dates")
def analytics_dates():
    pipeline = [
        {"$group": {"_id": "$date", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    result = list(appointments.aggregate(pipeline))
    formatted_result = [{"date": item["_id"], "count": item["count"]} for item in result]
    return formatted_result