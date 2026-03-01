import sys
import os
import io
import traceback
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
from dotenv import load_dotenv

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.gemini_service import gemini_service

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "LeaseLens AI Analysis Backend Running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")
    if not file.filename.endswith(('.pdf', '.doc', '.docx', '.txt')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload PDF, Word, or Text.")

    # 1. Extract Text
    contents = await file.read()
    raw_text = ""
    
    try:
        if file.filename.endswith('.pdf'):
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        raw_text += extracted + "\n"
        else:
            raw_text = contents.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Extraction Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Document appears to be empty or unscannable.")

    print(f"Extracted {len(raw_text)} characters.")

    # 2. Analyze using Service
    try:
        analysis_data = await gemini_service.analyze_lease(file.filename, raw_text)
        # Ensure the frontend gets the original text for the highlighter to work reliably
        analysis_data["full_text"] = raw_text
        return analysis_data
    except Exception as e:
        print(f"Service Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)