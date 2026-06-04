from tools.booking_tool import (
    book_appointment
)

result = book_appointment(
    customer="Pawan",
    service="Haircut",
    date="2026-06-15",
    time="3 PM"
)

print(result)