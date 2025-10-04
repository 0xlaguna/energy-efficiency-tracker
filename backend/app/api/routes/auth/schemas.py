from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Login request schema"""
    
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$', description="User email")
    password: str = Field(..., min_length=1, description="User password")


class LoginResponse(BaseModel):
    """Login response schema"""
    
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")


class ErrorResponse(BaseModel):
    """Error response schema"""
    
    detail: str = Field(..., description="Error message")
