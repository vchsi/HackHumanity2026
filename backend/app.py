from fastapi import FastAPI, UploadFile, File
import pdfplumber
import io

import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "LeaseLens backend running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()

    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return {
        "filename": file.filename,
        "extracted_text_preview": text[:500]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)