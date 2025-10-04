from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.routes import health_router, user_router, auth_router

from app.infrastructure.logging import configure_logging, get_logger
from app.infrastructure.database import database
from app.infrastructure.cache import cache_service
from app.application.services.system_user_service import SystemUserService
from app.api.dependencies import get_auth_service


logger = get_logger(__name__)

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting application")
    
    configure_logging()
    
    await database.connect()
    logger.info("Connected to database")
    
    await cache_service.connect()
    logger.info("Connected to cache")
    
    # Create system user for testing
    try:
        auth_service = get_auth_service()
        system_user_service = SystemUserService(auth_service)
        await system_user_service.create_system_user()
        logger.info("System user setup completed")
    except Exception as e:
        logger.error(f"Failed to create system user: {e}")
    
    yield
    
    logger.info("Shutting down application")
    
    await cache_service.disconnect()
    logger.info("Disconnected from cache")
    
    await database.disconnect()
    logger.info("Disconnected from database")


# Create FastAPI application
app = FastAPI(
    title="Energy Efficiency Tracker API",
    description="API for energy efficiency tracker",
    version="0.1.0",
    lifespan=lifespan,
)
app.include_router(health_router, prefix=API_PREFIX)
app.include_router(user_router, prefix=API_PREFIX)
app.include_router(auth_router, prefix=API_PREFIX)
