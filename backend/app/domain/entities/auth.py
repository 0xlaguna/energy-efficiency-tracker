from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, EmailStr


class AuthUser(BaseModel):
    """Authenticated user domain entity"""
    
    id: Optional[str] = None
    email: EmailStr = Field(..., description="User email")
    password_hash: str
    is_active: bool = Field(default=True)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class Token(BaseModel):
    """JWT token domain entity"""
    
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class LoginRequest(BaseModel):
    """Login request domain entity"""
    
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=1)
