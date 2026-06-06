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

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str

class AppointmentUpdate(BaseModel):

    customer: str
    service: str
    date: str
    time: str


@api.post("/chat")
def chat(request: ChatRequest):

    result = agent_app.invoke(
        {
            "question": request.question,
            "intent": "",
            "answer": ""
        }
    )

    save_conversation(
        request.question,
        result["answer"]
    )

    return {
        "answer": result["answer"]
    }

@api.post("/speech-to-text")
async def transcribe_audio(
        file: UploadFile = File(...)
):

    os.makedirs(
        "audio_uploads",
        exist_ok=True
    )

    file_path = f"audio_uploads/{file.filename}"

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
        "transcript": transcript
    }

@api.post("/text-to-speech")
def generate_speech(request: ChatRequest):

    audio_path = text_to_speech(
        request.question
    )

    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename="response.mp3"
    )

@api.get("/conversations")
def conversation_history():

    return get_conversations()

from database.conversations import conversations

@api.delete("/conversations")
def clear_history():

    conversations.delete_many({})

    return {
        "message": "History cleared"
    }

# ==========================
# Admin Dashboard APIs
# ==========================

@api.get("/appointments")
def all_appointments():

    return get_all_appointments()


@api.delete("/appointments/{appointment_id}")
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


@api.put("/appointments/{appointment_id}")
def update_appointment(
        appointment_id: str,
        appointment: AppointmentUpdate
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