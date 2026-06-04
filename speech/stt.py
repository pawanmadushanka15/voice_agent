import os
from dotenv import load_dotenv
from deepgram import DeepgramClient, PrerecordedOptions

load_dotenv()

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")


def speech_to_text(audio_path):

    deepgram = DeepgramClient(DEEPGRAM_API_KEY)

    with open(audio_path, "rb") as file:
        buffer_data = file.read()

    payload = {
        "buffer": buffer_data,
    }

    options = PrerecordedOptions(
        model="nova-2",
        smart_format=True
    )

    response = deepgram.listen.prerecorded.v("1").transcribe_file(
        payload,
        options
    )

    transcript = (
        response.results.channels[0]
        .alternatives[0]
        .transcript
    )

    return transcript


# For testing directly
if __name__ == "__main__":

    AUDIO_FILE = "audio/sample.wav"

    print("Current Directory:", os.getcwd())
    print("Audio Exists:", os.path.exists(AUDIO_FILE))

    transcript = speech_to_text(AUDIO_FILE)

    print("\nTranscript:")
    print(transcript)