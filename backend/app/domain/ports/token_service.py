from abc import ABC, abstractmethod
from typing import Dict, Any

from app.domain.entities.auth import AuthUser, Token


class TokenService(ABC):
    """Port for token operations"""
    
    @abstractmethod
    async def create_token(self, user: AuthUser) -> Token:
        """Create JWT token for user"""
        pass
    
    @abstractmethod
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode JWT token"""
        pass
    
    @abstractmethod
    async def refresh_token(self, token: str) -> Token:
        """Refresh JWT token"""
        pass
