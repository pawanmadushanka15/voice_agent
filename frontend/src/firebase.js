import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBY5eDjmsWXN2mj2XD74CoiFqmussYsQog",
  authDomain: "voice-ai-agent-146b7.firebaseapp.com",
  projectId: "voice-ai-agent-146b7",
  storageBucket: "voice-ai-agent-146b7.firebasestorage.app",
  messagingSenderId: "28447382615",
  appId: "1:28447382615:web:ae992a6d4eb2f0cf7c9712"
};

const app = initializeApp(
  firebaseConfig
);

export const auth =
  getAuth(app);