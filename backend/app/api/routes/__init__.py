from app.api.routes.health import router as health_router
from app.api.routes.users.user import router as user_router
from app.api.routes.auth.auth import router as auth_router

__all__ = ["health_router", "user_router", "auth_router"]
