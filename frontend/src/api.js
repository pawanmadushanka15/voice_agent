// Centralized API configuration
// In development: uses localhost
// In production: uses the VITE_API_URL environment variable (your Koyeb/HF Spaces URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default API_BASE_URL;
