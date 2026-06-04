from database.mongo import appointments

appointments.insert_one({
    "customer": "Pawan",
    "service": "Haircut",
    "date": "2026-06-10",
    "time": "3 PM"
})

print("Appointment Saved")