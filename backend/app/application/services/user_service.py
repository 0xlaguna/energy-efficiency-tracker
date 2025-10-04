from app.domain.entities.user import User
from app.domain.ports.cache_service import CacheService
from app.domain.ports.user_repository import UserRepository


class UserService:
    """User application service"""

    def __init__(self, user_repository: UserRepository, cache_service: CacheService):
        """Initialize user service with dependencies"""
        self.user_repository = user_repository
        self.cache_service = cache_service

    async def create_user(self, user: User) -> User:
        """Create a new user"""
        created_user = await self.user_repository.create(user)

        return created_user

    async def get_user(self, user_id: str) -> User | None:
        """Get user by ID"""
        return await self.user_repository.get_by_id(user_id)

    async def get_users_paginated(self, skip: int = 0, limit: int = 10) -> list[User]:
        """Get paginated users"""
        users = await self.user_repository.get_paginated(skip, limit)

        return users

    async def get_users_count(self) -> int:
        """Get total count of users"""
        return await self.user_repository.count()
    
    async def get_user_by_email(self, email: str) -> User | None:
        """Get user by email"""
        return await self.user_repository.get_by_email(email)
