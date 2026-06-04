import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

voices = client.voices.get_all()

for voice in voices.voices:
    print(f"Name: {voice.name}")
    print(f"ID: {voice.voice_id}")
    print("-" * 50)