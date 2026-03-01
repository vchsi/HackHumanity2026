import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)
# We saw models/gemini-2.5-flash-native-audio-preview-12-2025
model_name = "gemini-2.5-flash-native-audio-preview-12-2025"
model = genai.GenerativeModel(model_name)

try:
    response = model.generate_content("Hello! Are you there?")
    print("AI Response:", response.text)
except Exception as e:
    print(f"Error for {model_name}: {str(e)}")
