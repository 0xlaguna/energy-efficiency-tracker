from fastapi import FastAPI
from app.api.routes import router

# Create FastAPI application

app = FastAPI(
    title="Energy Efficiency Tracker API",
    description="API for energy efficiency tracker",
    version="0.1.0",
)
app.include_router(router, prefix="/api/v1")
