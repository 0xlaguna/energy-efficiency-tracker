from abc import ABC, abstractmethod


class PasswordService(ABC):
    """Port for password operations"""
    
    @abstractmethod
    async def hash_password(self, password: str) -> str:
        """Hash a password"""
        pass
    
    @abstractmethod
    async def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        pass
