from datetime import datetime, timedelta, timezone
from typing import Dict, Any

from jose import JWTError, jwt

from app.domain.entities.auth import AuthUser, Token
from app.domain.ports.token_service import TokenService
from app.infrastructure.config import settings


class JWTTokenService(TokenService):
    """JWT token service implementation"""
    
    def __init__(self):
        """Initialize token service"""
        self.secret_key =settings.jwt_secret_key
        self.algorithm =settings.jwt_algorithm
        self.access_token_expire_minutes =settings.jwt_expire_days * 24 * 60  # 3 days in minutes
    
    async def create_token(self, user: AuthUser) -> Token:
        """Create JWT token for user"""
        expire = datetime.now(timezone.utc) + timedelta(minutes=self.access_token_expire_minutes)
        
        to_encode = {
            "sub": user.id,
            "email": user.email,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
        }
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        
        return Token(
            access_token=encoded_jwt,
            token_type="bearer",
            expires_in=self.access_token_expire_minutes * 60  # Convert to seconds
        )
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            raise ValueError("Invalid token")
    
    async def refresh_token(self, token: str) -> Token:
        """Refresh JWT token"""
        payload = await self.verify_token(token)
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise ValueError("Invalid token payload")
        
        user = AuthUser(id=user_id, email=email, password_hash="")
        return await self.create_token(user)
