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