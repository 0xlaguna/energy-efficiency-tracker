from app.application.services.auth_service import AuthService
from app.infrastructure.logging import get_logger

logger = get_logger(__name__)


class SystemUserService:
    """Service for managing system users"""
    
    def __init__(self, auth_service: AuthService):
        """Initialize system user service"""
        self.auth_service = auth_service
    
    async def create_system_user(self) -> None:
        """Create system user for testing purposes"""
        system_email = "system@energy-tracker.com"
        system_password = "system123"
        
        try:
            existing_user = await self.auth_service.get_user_by_id("system")
            if existing_user:
                logger.info("System user already exists")
                return
            
            await self.auth_service.create_user(system_email, system_password)
            logger.info(f"System user created with email: {system_email}")
            
        except ValueError as e:
            if "already exists" in str(e):
                logger.info("System user already exists")
            else:
                logger.error(f"Failed to create system user: {e}")
        except Exception as e:
            logger.error(f"Unexpected error creating system user: {e}")
