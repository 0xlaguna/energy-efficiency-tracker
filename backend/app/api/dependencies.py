from fastapi import Depends

from app.application.services.user_service import UserService
from app.domain.ports.cache_service import CacheService
from app.domain.ports.user_repository import UserRepository
from app.infrastructure.repositories.user_repository import MongoDBUserRepository
from app.infrastructure.cache import cache_service



def get_user_repository() -> UserRepository:
    """Get user repository instance"""
    return MongoDBUserRepository()


def get_cache_service() -> CacheService:
    """Get cache service instance"""
    return cache_service


def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
    cache_service: CacheService = Depends(get_cache_service),
) -> UserService:
    """Get user service instance with dependencies"""
    return UserService(user_repository, cache_service)
