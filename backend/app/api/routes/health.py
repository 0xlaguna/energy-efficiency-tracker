from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter(tags=["health"])

# Health check endpoint
@router.get("/health", response_model=dict)
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
