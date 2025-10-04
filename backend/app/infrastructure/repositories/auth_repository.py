from datetime import datetime, timezone
from typing import Optional

from pymongo.errors import DuplicateKeyError

from app.domain.entities.auth import AuthUser
from app.domain.ports.auth_repository import AuthRepository
from app.infrastructure.database import database


class MongoAuthRepository(AuthRepository):
    """MongoDB authentication repository implementation"""
    
    def __init__(self):
        """Initialize repository"""
        self.collection_name = "auth_users"
    
    async def create_user(self, user: AuthUser) -> AuthUser:
        """Create a new authenticated user"""
        user_dict = user.model_dump(exclude={"id"})
        user_dict["created_at"] = datetime.now(timezone.utc)
        user_dict["updated_at"] = datetime.now(timezone.utc)
        
        try:
            result = await database.database[self.collection_name].insert_one(user_dict)
            user.id = str(result.inserted_id)
            user.created_at = user_dict["created_at"]
            user.updated_at = user_dict["updated_at"]
            return user
        except DuplicateKeyError:
            raise ValueError("User with this email already exists")
    
    async def get_user_by_email(self, email: str) -> Optional[AuthUser]:
        """Get user by email"""
        user_dict = await database.database[self.collection_name].find_one({"email": email})
        
        if not user_dict:
            return None
        
        user_dict["id"] = str(user_dict["_id"])
        del user_dict["_id"]
        
        return AuthUser(**user_dict)
    
    async def get_user_by_id(self, user_id: str) -> Optional[AuthUser]:
        """Get user by ID"""
        from bson import ObjectId
        
        try:
            user_dict = await database.database[self.collection_name].find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None
        
        if not user_dict:
            return None
        
        user_dict["id"] = str(user_dict["_id"])
        del user_dict["_id"]
        
        return AuthUser(**user_dict)
    
    async def update_user(self, user: AuthUser) -> AuthUser:
        """Update user"""
        from bson import ObjectId
        
        user_dict = user.model_dump(exclude={"id"})
        user_dict["updated_at"] = datetime.now(timezone.utc)
        
        await database.database[self.collection_name].update_one(
            {"_id": ObjectId(user.id)},
            {"$set": user_dict}
        )
        
        user.updated_at = user_dict["updated_at"]
        return user
    
    async def user_exists(self, email: str) -> bool:
        """Check if user exists by email"""
        count = await database.database[self.collection_name].count_documents({"email": email})
        return count > 0
