from tools.extract_booking import (
    extract_booking_details
)

result = extract_booking_details(
    "Book a haircut tomorrow at 5 PM"
)

print(result)