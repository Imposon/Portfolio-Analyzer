"""
Main FastAPI application entry point.
Configures CORS, initializes database, and registers API routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database.db import init_db
from routes import portfolio, analysis, ai_analysis
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    yield
app = FastAPI(
    title="AI-Powered Investment Advisor API",
    description="Production-grade portfolio recommendation API with AI-generated explanations",
    version="1.0.0",
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(portfolio.router)
app.include_router(analysis.router)
app.include_router(ai_analysis.router)
@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "message": "AI-Powered Investment Advisor API",
        "version": "1.0.0",
        "status": "running"
    }
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}