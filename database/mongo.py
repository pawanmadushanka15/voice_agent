import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI)

db = client.voice_agent

appointments = db.appointments
conversations = db.conversations

print("MongoDB Connected")