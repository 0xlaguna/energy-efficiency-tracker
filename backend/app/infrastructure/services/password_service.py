from passlib.context import CryptContext

from app.domain.ports.password_service import PasswordService


class BcryptPasswordService(PasswordService):
    """Bcrypt password service implementation"""
    
    def __init__(self):
        """Initialize password service"""
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    async def hash_password(self, password: str) -> str:
        """Hash a password"""
        return self.pwd_context.hash(password)
    
    async def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return self.pwd_context.verify(password, hashed_password)
