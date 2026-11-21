# 🎙️ Salon AI Receptionist — Autonomous Multimodal Voice & Booking Agent

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.137-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.2-FF6F00?style=for-the-badge&logo=langchain&logoColor=white)](https://www.langchain.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

An end-to-end, production-ready AI Voice Receptionist built for salons and service businesses. Customers can converse naturally via **voice or text** to inquire about services, ask policy and pricing questions, book new appointments, reschedule existing bookings, or cancel appointments.

Includes an **Admin Dashboard** with interactive charts to monitor appointments, analyze service trends, and manage bookings in real time.

---

## 🌟 Key Features

- 🗣️ **Multimodal Voice Pipeline**:
  - **Speech-to-Text (STT)**: High-accuracy, low-latency audio transcription powered by **Deepgram Nova-2**.
  - **Text-to-Speech (TTS)**: Lifelike, expressive voice synthesis powered by **ElevenLabs**.
- 🧠 **Agentic Decision Graph (LangGraph)**:
  - Stateful multi-node architecture that classifies user intent (`booking`, `reschedule`, `cancel`, `faq`, `general_chat`) and executes specialized tool nodes accordingly.
  - Multi-turn slot filling for appointment details (Customer, Service, Date, Time).
- 📚 **Contextual RAG (Retrieval-Augmented Generation)**:
  - Salon services, pricing, and salon policies are embedded with **Sentence-Transformers** (`all-MiniLM-L6-v2`) and stored in a **ChromaDB** vector database to ensure grounded, hallucination-free answers.
- 📅 **Smart Appointment Management**:
  - Live slot availability checks, duplicate detection, automated rescheduling, and booking cancellations persisted in **MongoDB Atlas**.
- 🔐 **Authentication & Security**:
  - Secure user registration and login via **Firebase Authentication** (Google OAuth and Email/Password).
- 📊 **Real-time Admin Analytics**:
  - Interactive dashboard built with **Recharts** displaying total bookings, service distribution breakdown (pie chart), and daily booking trends (bar chart).

---

## 🏛️ System Architecture

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                           React 19 Frontend                            │
 │   - Voice Recording (MediaRecorder)         - Chat Interface           │
 │   - Firebase Authentication                 - Admin Analytics Panel    │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                            FastAPI Backend                             │
 │                                                                        │
 │   [ /speech-to-text ] ──► Deepgram Nova-2 STT                          │
 │   [ /text-to-speech ] ──► ElevenLabs TTS Engine                        │
 │                                                                        │
 │   [ /chat ] ────────────► LangGraph StateGraph Router                  │
 │                                   │                                    │
 │         ┌─────────────────────────┼─────────────────────────┐          │
 │         ▼                         ▼                         ▼          │
 │    Booking Node               RAG Node                  Chat Node      │
 │  (Extract & Slot Fill)  (ChromaDB + MiniLM)          (Groq Llama 3.3)  │
 │         │                         │                         │          │
 └─────────┼─────────────────────────┼─────────────────────────┼──────────┘
           ▼                         ▼                         ▼
    MongoDB Atlas              ChromaDB Store             Groq LLM
  (Appointments & Logs)      (Salon Knowledge)         (Fast Inference)
```

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Backend Framework** | [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/) |
| **Agent Orchestration** | [LangGraph](https://www.langchain.com/langgraph), [LangChain](https://www.langchain.com/) |
| **LLM Inference** | [Groq](https://groq.com/) (`llama-3.3-70b-versatile`) |
| **Voice / Audio** | [Deepgram](https://deepgram.com/) (STT), [ElevenLabs](https://elevenlabs.io/) (TTS) |
| **Vector Store & Embeddings** | [ChromaDB](https://www.trychroma.com/), [Hugging Face sentence-transformers](https://huggingface.co/sentence-transformers) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) (via PyMongo) |
| **Frontend Framework** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [React Icons](https://react-icons.github.io/react-icons/) |
| **Charts & Analytics** | [Recharts](https://recharts.org/) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/products/auth) |
| **DevOps & Containers** | [Docker](https://www.docker.com/), [Vercel](https://vercel.com/) |

---

## 📁 Project Directory Structure

```text
├── audio/                   # Sample audio input files
├── audio_uploads/           # Temp storage for voice recording uploads
├── chroma_db/               # Persistent ChromaDB vector database
├── data/
│   └── faq.txt              # Salon knowledge base (services, prices, policies)
├── database/
│   ├── appointments.py      # MongoDB appointment queries
│   ├── chat_history.py      # Conversation log management
│   ├── conversations.py     # MongoDB conversation collections
│   ├── mongo.py             # MongoDB client connection
│   └── session_manager.py   # Multi-turn booking session state
├── frontend/                # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/      # UI & Auth reusable components
│   │   ├── Admin.jsx        # Admin dashboard & analytics charts
│   │   ├── App.jsx          # Main voice & text chat application
│   │   ├── AuthContext.jsx  # Firebase authentication context
│   │   ├── firebase.js      # Firebase SDK configuration
│   │   └── api.js           # API base URL configuration
│   ├── package.json
│   ├── vercel.json          # SPA rewrite rules for production
│   └── vite.config.js
├── outputs/generated_audio/ # Generated TTS audio responses
├── speech/
│   ├── stt.py               # Deepgram Speech-to-Text transcription
│   └── tts.py               # ElevenLabs Text-to-Speech synthesis
├── tools/
│   ├── availability_checker.py # Checks open booking slots
│   ├── booking_tool.py         # Inserts new appointments
│   ├── cancel_booking.py       # Cancels appointments
│   ├── conversational_booking.py # Multi-turn booking slot logic
│   ├── extract_booking.py      # LLM entity extraction
│   ├── reschedule_booking.py   # Modifies existing appointments
│   └── smart_booking.py        # End-to-end booking runner
├── voice_agents/
│   ├── intent_classifier.py    # Classifies user questions into intent paths
│   ├── state.py                # LangGraph state schema definition
│   └── voice_agent.py          # StateGraph definition and compilation
├── .env.example             # Template for environment variables
├── api.py                   # FastAPI server entrypoint & REST endpoints
├── Dockerfile               # Multi-platform container configuration
├── rag_chat.py              # Contextual RAG search implementation
├── rag_ingest.py            # Knowledge base ingestion & vectorization script
└── requirements.txt         # Python backend dependencies
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: v18 or higher (v20+ recommended)
- **MongoDB**: A free MongoDB Atlas cluster connection string
- **API Keys**:
  - [Groq Cloud API Key](https://console.groq.com/)
  - [Deepgram API Key](https://console.deepgram.com/)
  - [ElevenLabs API Key](https://elevenlabs.io/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/pawanmadushanka15/voice_agent.git
cd voice_agent
```

---

### Step 2: Backend Setup

1. **Create and activate a virtual environment**:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   DEEPGRAM_API_KEY=your_deepgram_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   MONGODB_URI=your_mongodb_connection_string_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **(Optional) Re-index Knowledge Base**:
   To update or re-embed salon data from `data/faq.txt`:
   ```bash
   python rag_ingest.py
   ```

5. **Start the FastAPI backend server**:
   ```bash
   uvicorn api:api --reload --host 127.0.0.1 --port 8000
   ```
   The API will be available at: `http://127.0.0.1:8000` (Interactive docs at `http://127.0.0.1:8000/docs`).

---

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   Open your browser at: `http://localhost:5173`

---

## 🐳 Running with Docker

You can build and run the entire backend container locally:

```bash
# Build the Docker image
docker build -t voice-agent-backend .

# Run the container
docker run -p 7860:7860 --env-file .env voice-agent-backend
```

The containerized backend will listen at `http://localhost:7860`.

---

## 📡 Key REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check endpoint |
| `POST` | `/chat` | Processes user query through LangGraph & returns agent reply |
| `POST` | `/speech-to-text` | Accepts audio file (`multipart/form-data`) and returns transcription |
| `POST` | `/text-to-speech` | Synthesizes response text and returns streaming audio (`audio/mpeg`) |
| `GET` | `/conversations` | Retrieves chat history for a specific `user_id` |
| `DELETE` | `/conversations` | Clears conversation history for a specific `user_id` |
| `GET` | `/appointments` | Fetches all scheduled customer appointments |
| `PUT` | `/appointments/{id}` | Updates details for an existing appointment |
| `DELETE` | `/appointments/{id}` | Deletes an appointment by ID |
| `GET` | `/dashboard-stats` | Returns total appointment count and category metrics |
| `GET` | `/analytics/services` | Aggregates appointment count grouped by service |
| `GET` | `/analytics/dates` | Aggregates appointment count grouped by scheduled date |

---

## ☁️ Deployment Guide

### Deploy Backend (Render / Hugging Face Spaces)
1. Push your repository to GitHub.
2. In [Render](https://render.com), create a **New Web Service** connected to your repository.
3. Select **Docker** environment (or set build command to `pip install -r requirements.txt` and start command to `uvicorn api:api --host 0.0.0.0 --port $PORT`).
4. Add all environment variables (`GROQ_API_KEY`, `DEEPGRAM_API_KEY`, `ELEVENLABS_API_KEY`, `MONGODB_URI`).
5. Copy the generated public URL (e.g., `https://your-backend.onrender.com`).

### Deploy Frontend (Vercel)
1. Import your GitHub repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add the environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com`
4. Deploy!
5. In your Firebase Console, add your Vercel domain to **Authentication > Settings > Authorized domains**.
6. Set `FRONTEND_URL` on your backend environment variables to your Vercel URL to allow secure CORS requests.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Pawan Madushanka**  
- GitHub: [@pawanmadushanka15](https://github.com/pawanmadushanka15)
- LinkedIn: [Connect on LinkedIn](https://www.linkedin.com)
