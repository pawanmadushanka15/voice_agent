from speech.tts import text_to_speech

file_path = text_to_speech(
    "Hello Pawan, your appointment has been booked successfully."
)

print(file_path)