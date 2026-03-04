import json
import sys
import os
import io
import traceback
import uvicorn
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
import pdfplumber
from dotenv import load_dotenv
from backend_logic import query_response, query_lease, pull_report_data
from sb_connector import SBConnector

sb = SBConnector()

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.gemini_service import gemini_service

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:5173", # for testing purposes
        "https://leasify-0abe211b7a7d.herokuapp.com", # production heroku
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def root():
    return {"message": "lapi"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), owner_email: str = Form("user@example.com")):
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
            #print(owner_email)
        else:
            raw_text = contents.decode('utf-8', errors='ignore')
        try:
            result = query_lease(file.filename, raw_text=raw_text, owner_email=owner_email)  # Store raw text in DB for reference
        except Exception as e:
            raise Exception(f"Database Error: {str(e)}")
        if not result:
            raise Exception("Database Error: Failed to create lease record (Supabase client may not be initialized)")
        lease_id = result.get("lease_id")
        #print(f"new lease created @ Lease ID: {lease_id}")
    except Exception as e:
        print(f"Extraction Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Document appears to be empty or unscannable.")

    print(f"Extracted {len(raw_text)} characters.")

    # 2. Analyze using Service
    try:
        analysis_data = await gemini_service.analyze_lease(file.filename, raw_text)
        result2 = query_response(json.dumps(analysis_data), lease_id=lease_id, new_lease=False, new_lease_data=None)
        print(f"Analysis complete for Lease ID: {lease_id}")
        # Ensure the frontend gets the original text for the highlighter to work reliably
        analysis_data["full_text"] = raw_text
        return analysis_data
    except Exception as e:
        print(f"Service Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
async def get_history(email: str = Query(...)):
    """Fetch all leases + overviews for a given user email."""
    try:
        # Get leases for this user
        leases_result = sb.pull_data("leases", query={"owner_id": email})
        if not leases_result or leases_result.get("status") != "success":
            return {"leases": []}

        leases = leases_result.get("data", [])
        if not leases:
            return {"leases": []}

        # Get overviews for all lease IDs
        lease_ids = [l["id"] for l in leases]
        overviews_map = {}
        for lid in lease_ids:
            ov = sb.pull_data("ai_overviews", query={"lease_id": lid})
            if ov and ov.get("status") == "success" and ov.get("data"):
                overviews_map[lid] = ov["data"][0]

        # Combine
        result = []
        for lease in leases:
            overview = overviews_map.get(lease["id"])
            result.append({
                "id": lease["id"],
                "pathname": lease.get("pathname", ""),
                "created_at": lease.get("created_at", ""),
                "owner_id": lease.get("owner_id", ""),
                "overview": {
                    "risk_score": overview.get("risk_score", 0),
                    "overview_contents": overview.get("overview_contents", ""),
                    "rent_monthly": overview.get("rent_monthly"),
                } if overview else None
            })

        # Sort by created_at descending
        result.sort(key=lambda x: x["created_at"], reverse=True)
        return {"leases": result}

    except Exception as e:
        print(f"History Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/report/{lease_id}")
async def get_report(lease_id: int):
    """Fetch detailed report for a given lease ID."""
    try:
        report_data = pull_report_data(lease_id)
        if not report_data:
            raise HTTPException(status_code=404, detail="Report not found for this lease ID.")
        return report_data
    except Exception as e:
        print(f"Report Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/translate")
async def translate_text(payload: dict = Body(...)):
    """Translate text using Gemini (keeps API key server-side)."""
    text = payload.get("text", "").strip()
    language = payload.get("language", "").strip()

    if not text or not language:
        raise HTTPException(status_code=400, detail="Both 'text' and 'language' are required.")

    try:
        import google.generativeai as genai
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        prompt = (
            f"Translate the following lease expert review bullet points into {language}. "
            f"Keep the same list format. Return ONLY the translated text: {text}"
        )
        result = model.generate_content(prompt)
        translated = result.text
        return {"translated_text": translated}
    except Exception as e:
        print(f"Translation Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


@app.post("/tts")
async def text_to_speech(payload: dict = Body(...)):
    """Proxy ElevenLabs TTS request (keeps API key server-side). Returns audio/mpeg."""
    text = payload.get("text", "").strip()
    voice_id = payload.get("voice_id", "21m00Tcm4TlvDq8ikWAM").strip()

    if not text:
        raise HTTPException(status_code=400, detail="'text' is required.")

    api_key = os.getenv("ELEVENLABS_API_KEY") or os.getenv("VITE_ELEVENLABS_API_KEY", "")
    api_key = api_key.strip()
    if not api_key:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY is not configured on the server.")

    try:
        import httpx
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={
                    "Content-Type": "application/json",
                    "xi-api-key": api_key,
                    "Accept": "audio/mpeg",
                },
                json={
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {
                        "stability": 0.6,
                        "similarity_boost": 0.8,
                        "style": 0.4,
                        "use_speaker_boost": True,
                    },
                },
            )
        if resp.status_code != 200:
            detail = resp.text[:500]
            raise HTTPException(status_code=resp.status_code, detail=f"ElevenLabs error: {detail}")

        return Response(content=resp.content, media_type="audio/mpeg")
    except HTTPException:
        raise
    except Exception as e:
        print(f"TTS Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")


# --- Serve Frontend Static Files ---
static_dir = Path(__file__).parent / "static"
if static_dir.is_dir():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """Catch-all: serve index.html for any non-API route (SPA support)."""
        file_path = static_dir / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(static_dir / "index.html"))

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)