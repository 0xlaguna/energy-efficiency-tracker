from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.user import User



class UserRepository(ABC):
    """Port for user repository operations"""
    
    @abstractmethod
    async def create(self, user: User) -> User:
        """Create a new user"""
        pass
    
    @abstractmethod
    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        pass
    
    @abstractmethod
    async def get_paginated(self, skip: int = 0, limit: int = 10) -> List[User]:
        """Get paginated users"""
        pass
    
    @abstractmethod
    async def count(self) -> int:
        """Get total count of users"""
        pass
