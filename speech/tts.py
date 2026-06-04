from pathlib import Path
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import save
import os

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)


def text_to_speech(text):

    audio = client.generate(
        text=text,
        voice="EXAVITQu4vr4xnSDxMaL",  # Sarah
        model="eleven_multilingual_v2"
    )

    output_dir = Path("outputs/generated_audio")
    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    output_file = (
        output_dir / "response.mp3"
    )

    save(
        audio,
        str(output_file)
    )

    return str(output_file)