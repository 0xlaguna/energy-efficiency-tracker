from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities.auth import AuthUser


class AuthRepository(ABC):
    """Port for authentication repository operations"""
    
    @abstractmethod
    async def create_user(self, user: AuthUser) -> AuthUser:
        """Create a new authenticated user"""
        pass
    
    @abstractmethod
    async def get_user_by_email(self, email: str) -> Optional[AuthUser]:
        """Get user by email"""
        pass
    
    @abstractmethod
    async def get_user_by_id(self, user_id: str) -> Optional[AuthUser]:
        """Get user by ID"""
        pass
    
    @abstractmethod
    async def update_user(self, user: AuthUser) -> AuthUser:
        """Update user"""
        pass
    
    @abstractmethod
    async def user_exists(self, email: str) -> bool:
        """Check if user exists by email"""
        pass
