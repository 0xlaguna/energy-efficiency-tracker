from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class UserResponse(BaseModel):
    """Schema for user response."""
    id: str
    name: str
    email: str
    created_at: datetime
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class PaginationParams(BaseModel):
    """Schema for pagination parameters"""
    skip: int = Field(default=0, ge=0, description="Number of items to skip")
    limit: int = Field(default=10, ge=1, le=100, description="Number of items to return")


class PaginatedResponse(BaseModel):
    """Schema for paginated response"""
    items: List[UserResponse]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool
