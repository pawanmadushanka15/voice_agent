import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMicrophone, 
  FaStop, 
  FaPaperPlane, 
  FaTrash, 
  FaSignOutAlt,
  FaRobot,
  FaUser
} from "react-icons/fa";

function App() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    loadHistory();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/conversations");
      const history = [];
      response.data.forEach(item => {
        history.push({ role: "user", text: item.question });
        history.push({ role: "assistant", text: item.answer });
      });
      setMessages(history);
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete("http://127.0.0.1:8000/conversations");
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  };

  const playAudio = async (text) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/text-to-speech", {
        question: text,
        user_id: user?.uid || "anonymous",
        email: user?.email || "anonymous@example.com"
      }, { responseType: "blob" });
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error("Audio playback failed", error);
    }
  };

  const askAgent = async (userQuestion = question) => {
    if (!userQuestion.trim()) return;
    const userMessage = { role: "user", text: userQuestion };
    setMessages(prev => [...prev, userMessage]);
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        question: userQuestion,
        user_id: user?.uid || "anonymous",
        email: user?.email || "anonymous@example.com"
      });
      const answer = response.data.answer;
      const botMessage = { role: "assistant", text: answer };
      setMessages(prev => [...prev, botMessage]);
      setQuestion("");
      await playAudio(answer);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", text: "Error contacting AI Agent." }]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];
      recorder.ondataavailable = (event) => { chunks.push(event.data); };
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", blob, "recording.wav");
        try {
          const response = await axios.post("http://127.0.0.1:8000/speech-to-text", formData);
          const transcript = response.data.transcript;
          setQuestion(transcript);
          await askAgent(transcript);
        } catch (error) {
          console.error("Speech-to-text failed:", error);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Microphone access denied", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black min-h-screen text-white font-sans flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Salon AI Receptionist
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">Book appointments using voice or text</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={clearHistory}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            title="Clear History"
          >
            <FaTrash className="text-slate-400" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button 
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 transition-colors"
            title="Logout"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-28 pb-32 overflow-y-auto z-10 flex flex-col" style={{ scrollbarWidth: 'none' }}>
        {messages.length === 0 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <FaRobot className="w-16 h-16 text-slate-700" />
            <p>How can I help you today?</p>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-auto ${
                  msg.role === "user" 
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 ml-3" 
                    : "bg-slate-800 border border-slate-700 mr-3"
                }`}>
                  {msg.role === "user" ? <FaUser className="w-3.5 h-3.5 text-white" /> : <FaRobot className="w-4 h-4 text-purple-400" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-sm shadow-lg"
                    : "bg-white/5 backdrop-blur-sm border border-white/10 text-slate-200 rounded-bl-sm shadow-lg"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-6 w-full"
          >
            <div className="flex max-w-[85%] md:max-w-[75%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 mr-3 mt-auto">
                <FaRobot className="w-4 h-4 text-purple-400" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-bl-sm flex items-center space-x-2 h-12">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pb-6 pt-10 px-4 pointer-events-none">
        <div className="max-w-4xl mx-auto flex flex-col pointer-events-auto">
          {recording && (
            <div className="mb-3 flex items-center justify-center text-xs text-red-400 font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping mr-2"></span>
              Recording audio...
            </div>
          )}
          <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl shadow-2xl">
            
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                recording 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                  : "bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title={recording ? "Stop Recording" : "Start Voice Input"}
            >
              {recording ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaStop className="w-5 h-5" />
                </motion.div>
              ) : (
                <FaMicrophone className="w-5 h-5" />
              )}
            </button>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askAgent();
                }
              }}
              placeholder={recording ? "Listening..." : "Ask anything..."}
              className="flex-1 bg-transparent text-white placeholder-slate-400 px-4 py-3 focus:outline-none"
              disabled={recording}
            />

            <button
              onClick={() => askAgent()}
              disabled={!question.trim() || loading || recording}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;