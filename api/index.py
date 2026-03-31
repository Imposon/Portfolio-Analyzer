from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'investment-advisor', 'backend'))

from database.db import init_db
from routes import portfolio, analysis, ai_analysis

init_db()

app = FastAPI(
    title="AI-Powered Investment Advisor API",
    description="Production-grade portfolio recommendation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(ai_analysis.router, prefix="/api")

@app.get("/api")
async def root():
    return {
        "message": "AI-Powered Investment Advisor API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

handler = Mangum(app, lifespan="off")
