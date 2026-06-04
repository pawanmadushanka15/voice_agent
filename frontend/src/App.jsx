import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // ==========================
  // Load Conversation History
  // ==========================
  useEffect(() => {
    loadHistory();
  }, []);

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

  // ==========================
  // Clear History
  // ==========================
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

  // ==========================
  // Play Audio
  // ==========================
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

  // ==========================
  // Ask Agent
  // ==========================
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
    }
  };

  // ==========================
  // Start Recording
  // ==========================
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

          setQuestion(
            transcript
          );

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

  // ==========================
  // Stop Recording
  // ==========================
  const stopRecording = () => {

    if (mediaRecorder) {

      mediaRecorder.stop();

      setRecording(false);

    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "30px"
      }}
    >

      <h1>🎙 Voice AI Agent</h1>

      <button
        onClick={clearHistory}
        style={{
          marginBottom: "20px",
          padding: "10px"
        }}
      >
        Clear History
      </button>

      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "500px",
          padding: "20px",
          overflowY: "auto",
          marginBottom: "20px"
        }}
      >

        {messages.map(
          (msg, index) => (

            <div
              key={index}
              style={{
                marginBottom: "15px"
              }}
            >

              <strong>
                {msg.role === "user"
                  ? "You"
                  : "AI"}
              </strong>

              <p>{msg.text}</p>

            </div>
          )
        )}

      </div>

      <input
        value={question}
        onChange={(e) =>
          setQuestion(
            e.target.value
          )
        }
        placeholder="Ask anything..."
        style={{
          width: "60%",
          padding: "10px"
        }}
      />

      <button
        onClick={() =>
          askAgent()
        }
        style={{
          marginLeft: "10px",
          padding: "10px"
        }}
      >
        Send
      </button>

      <button
        onClick={startRecording}
        disabled={recording}
        style={{
          marginLeft: "10px",
          padding: "10px"
        }}
      >
        🎤 Start
      </button>

      <button
        onClick={stopRecording}
        disabled={!recording}
        style={{
          marginLeft: "10px",
          padding: "10px"
        }}
      >
        ⏹ Stop
      </button>

      <div
        style={{
          marginTop: "15px"
        }}
      >
        {recording
          ? "🔴 Recording..."
          : "⚪ Not Recording"}
      </div>

    </div>
  );
}

export default App;