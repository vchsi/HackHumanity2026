import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
print(f"Testing API key starting with {API_KEY[:5]}...")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

try:
    response = model.generate_content("Hello! Are you there?")
    print("AI Response:", response.text)
except Exception as e:
    print("Error during API call:", str(e))
