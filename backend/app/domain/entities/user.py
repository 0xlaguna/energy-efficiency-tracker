from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, EmailStr


class User(BaseModel):
    """User domain entity"""
    
    id: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(..., description="User email")
    created_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
