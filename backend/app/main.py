from fastapi import FastAPI
from app.api.routes import health_router, user_router


API_PREFIX = "/api/v1"

# Create FastAPI application
app = FastAPI(
    title="Energy Efficiency Tracker API",
    description="API for energy efficiency tracker",
    version="0.1.0",
)
app.include_router(health_router, prefix=API_PREFIX)
app.include_router(user_router, prefix=API_PREFIX)