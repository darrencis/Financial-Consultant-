"""HiveTwin API - uvicorn entrypoint."""
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory (works with uvicorn --reload subprocess)
load_dotenv(Path(__file__).resolve().parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from db.database import init_db

app = FastAPI(title="HiveTwin API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"message": "HiveTwin API", "docs": "/docs", "health": "/api/health"}


@app.on_event("startup")
async def startup():
    await init_db()
