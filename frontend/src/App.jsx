import { useState, useEffect } from "react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function App() {

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

const logout = async () => {

  await signOut(auth);

};

  const loadHistory = async () => {

    try {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/conversations"
        );

      const history = [];

      response.data.forEach(item => {

        history.push({
          role: "user",
          text: item.question
        });

        history.push({
          role: "assistant",
          text: item.answer
        });

      });

      setMessages(history);

    } catch (error) {

      console.error(
        "Failed to load history",
        error
      );
    }
  };

  const clearHistory = async () => {

    try {

      await axios.delete(
        "http://127.0.0.1:8000/conversations"
      );

      setMessages([]);

    } catch (error) {

      console.error(
        "Failed to clear history",
        error
      );
    }
  };

  const playAudio = async (text) => {

    try {

      const response =
        await axios.post(
          "http://127.0.0.1:8000/text-to-speech",
          {
            question: text
          },
          {
            responseType: "blob"
          }
        );

      const audioUrl =
        URL.createObjectURL(
          response.data
        );

      const audio =
        new Audio(audioUrl);

      await audio.play();

    } catch (error) {

      console.error(
        "Audio playback failed",
        error
      );
    }
  };

  const askAgent = async (
    userQuestion = question
  ) => {

    if (!userQuestion.trim()) return;

    const userMessage = {
      role: "user",
      text: userQuestion
    };

    setMessages(prev => [
      ...prev,
      userMessage
    ]);

    try {

      setLoading(true);

      const response =
        await axios.post(
          "http://127.0.0.1:8000/chat",
          {
            question: userQuestion
          }
        );

      const answer =
        response.data.answer;

      const botMessage = {
        role: "assistant",
        text: answer
      };

      setMessages(prev => [
        ...prev,
        botMessage
      ]);

      setQuestion("");

      await playAudio(answer);

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Error contacting AI Agent."
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  const startRecording = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      const recorder =
        new MediaRecorder(stream);

      let chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {

        const blob = new Blob(
          chunks,
          {
            type: "audio/wav"
          }
        );

        const formData =
          new FormData();

        formData.append(
          "file",
          blob,
          "recording.wav"
        );

        try {

          const response =
            await axios.post(
              "http://127.0.0.1:8000/speech-to-text",
              formData,
              {
                headers: {
                  "Content-Type":
                    "multipart/form-data"
                }
              }
            );

          const transcript =
            response.data.transcript;

          setQuestion(transcript);

          await askAgent(
            transcript
          );

        } catch (error) {

          console.error(
            "Speech-to-text failed:",
            error
          );
        }
      };

      recorder.start();

      setMediaRecorder(
        recorder
      );

      setRecording(true);

    } catch (error) {

      console.error(
        "Microphone access denied",
        error
      );
    }
  };

  const stopRecording = () => {

    if (mediaRecorder) {

      mediaRecorder.stop();

      setRecording(false);

    }
  };

  return (

    <div
      className="
      max-w-5xl
      mx-auto
      p-4
      md:p-8
      min-h-screen
      "
    >

      <h1
        className="
        text-4xl
        font-bold
        text-center
        mb-3
        "
      >
        Salon AI Receptionist
      </h1>

      <p
  className="
  text-center
  text-gray-500
  mb-6
  "
>
  Book appointments using voice or text
</p>

<div className="mb-4">

  <button
    onClick={clearHistory}
    className="
    px-4
    py-2
    border
    rounded
    mr-2
    "
  >
    Clear History
  </button>

  <button
    onClick={logout}
    className="
    px-4
    py-2
    border
    rounded
    "
  >
    Logout
  </button>

</div>

      <div
        className="
        border
        rounded
        p-4
        min-h-[500px]
        max-h-[600px]
        overflow-y-auto
        mb-4
        "
      >

        {messages.map(
          (msg, index) => (

            <div
              key={index}
              className={`
                mb-4
                flex
                ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }
              `}
            >

              <div
                className="
                max-w-[80%]
                border
                rounded-lg
                p-3
                "
              >

                <strong>
                  {msg.role === "user"
                    ? "You"
                    : "AI"}
                </strong>

                <p>{msg.text}</p>

              </div>

            </div>
          )
        )}

        {
          loading && (

            <div
              className="
              text-gray-500
              italic
              "
            >
              AI is thinking...
            </div>

          )
        }

      </div>

      <div
        className="
        flex
        flex-col
        md:flex-row
        gap-3
        "
      >

        <input
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="Ask anything..."
          className="
          flex-1
          border
          rounded
          p-3
          "
        />

        <button
          onClick={() =>
            askAgent()
          }
          className="
          px-5
          py-3
          border
          rounded
          "
        >
          Send
        </button>

        <button
          onClick={startRecording}
          disabled={recording}
          className="
          px-5
          py-3
          border
          rounded
          "
        >
          🎤 Start
        </button>

        <button
          onClick={stopRecording}
          disabled={!recording}
          className="
          px-5
          py-3
          border
          rounded
          "
        >
          ⏹ Stop
        </button>

      </div>

      <div
        className="
        mt-4
        text-center
        "
      >
        {
          recording
            ? "🔴 Recording..."
            : "⚪ Not Recording"
        }
      </div>

    </div>
  );
}

export default App;