from agent import llm
import json


def extract_booking_details(text):

    prompt = f"""
Extract appointment details from the user message.

Return ONLY valid JSON.

If a value is missing, use "UNKNOWN".

User Message:
{text}

Examples:

Input:
Book a haircut tomorrow at 4 PM

Output:
{{
    "service": "Haircut",
    "date": "tomorrow",
    "time": "4 PM"
}}

Input:
Book a beard trim on Friday at 2 PM

Output:
{{
    "service": "Beard Trim",
    "date": "Friday",
    "time": "2 PM"
}}

Now extract details from:

{text}
"""

    response = llm.invoke(prompt)

    try:

        content = response.content.strip()

        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

        return json.loads(content)

    except Exception as e:

        print("Extraction Error:", e)

        return {
            "service": "UNKNOWN",
            "date": "UNKNOWN",
            "time": "UNKNOWN"
        }