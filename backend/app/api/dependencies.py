from fastapi import Depends

from app.application.services.user_service import UserService
from app.application.services.auth_service import AuthService
from app.application.services.efficiency_service import EfficiencyService

from app.domain.ports.cache_service import CacheService
from app.infrastructure.cache import cache_service

from app.domain.ports.user_repository import UserRepository
from app.domain.ports.auth_repository import AuthRepository
from app.domain.ports.efficiency_repository import EfficiencyRepository

from app.domain.ports.password_service import PasswordService
from app.domain.ports.token_service import TokenService
from app.infrastructure.services.password_service import BcryptPasswordService
from app.infrastructure.services.token_service import JWTTokenService

from app.infrastructure.repositories.user_repository import MongoDBUserRepository
from app.infrastructure.repositories.auth_repository import MongoAuthRepository
from app.infrastructure.repositories.efficiency_repository import MongodbEfficiencyRepository



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


def get_auth_repository() -> AuthRepository:
    """Get auth repository instance"""
    return MongoAuthRepository()


def get_password_service() -> PasswordService:
    """Get password service instance"""
    return BcryptPasswordService()


def get_token_service() -> TokenService:
    """Get token service instance"""
    return JWTTokenService()


def get_auth_service(
    auth_repository: AuthRepository = Depends(get_auth_repository),
    password_service: PasswordService = Depends(get_password_service),
    token_service: TokenService = Depends(get_token_service),
) -> AuthService:
    """Get auth service instance with dependencies"""
    return AuthService(auth_repository, password_service, token_service)


def get_efficiency_repository() -> EfficiencyRepository:
    """Get efficiency repository instance"""
    return MongodbEfficiencyRepository()


def get_efficiency_service(
    efficiency_repository: EfficiencyRepository = Depends(get_efficiency_repository),
    cache_service: CacheService = Depends(get_cache_service),
) -> EfficiencyService:
    """Get efficiency service instance with dependencies"""
    return EfficiencyService(efficiency_repository, cache_service)
