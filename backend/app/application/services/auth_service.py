from typing import Optional

from app.domain.entities.auth import AuthUser, LoginRequest, Token
from app.domain.ports.auth_repository import AuthRepository
from app.domain.ports.password_service import PasswordService
from app.domain.ports.token_service import TokenService


class AuthService:
    """Authentication service"""
    
    def __init__(
        self,
        auth_repository: AuthRepository,
        password_service: PasswordService,
        token_service: TokenService
    ):
        """Initialize authentication service"""
        self.auth_repository = auth_repository
        self.password_service = password_service
        self.token_service = token_service
    
    async def login(self, login_request: LoginRequest) -> Token:
        """Authenticate user and return token"""
        # Get user by email
        user = await self.auth_repository.get_user_by_email(login_request.email)
        
        if not user:
            raise ValueError("Invalid email or password")
        
        if not user.is_active:
            raise ValueError("User account is disabled")
        
        # Verify password
        is_valid = await self.password_service.verify_password(
            login_request.password, 
            user.password_hash
        )
        
        if not is_valid:
            raise ValueError("Invalid email or password")
        
        return await self.token_service.create_token(user)
    
    async def create_user(self, email: str, password: str) -> AuthUser:
        """Create a new user"""
        if await self.auth_repository.user_exists(email):
            raise ValueError("User with this email already exists")
        
        # Hash password
        password_hash = await self.password_service.hash_password(password)
        
        # Create user
        user = AuthUser(
            email=email,
            password_hash=password_hash,
            is_active=True
        )
        
        return await self.auth_repository.create_user(user)
    
    async def get_user_by_id(self, user_id: str) -> Optional[AuthUser]:
        """Get user by ID"""
        return await self.auth_repository.get_user_by_id(user_id)
    
    async def verify_token(self, token: str) -> dict:
        """Verify JWT token and return payload"""
        return await self.token_service.verify_token(token)
