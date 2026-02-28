from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from sb_connector import SBConnector

# Initialize app
app = FastAPI(
    title="Leasify",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Response models
class HealthResponse(BaseModel):
    status: str


# Routes
@app.get("/")
async def root():
    return {"message": "Hi"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return {"status": "ok"}


# Server
if __name__ == "__main__":
    uvicorn.run(
        "main_fapi:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
