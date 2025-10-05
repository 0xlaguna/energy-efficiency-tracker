from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId

from app.domain.ports.user_repository import UserRepository
from app.domain.entities.user import User
from app.infrastructure.database import database


class MongoDBUserRepository(UserRepository):
    """MongoDB implementation of UserRepository"""
    
    def __init__(self, collection=None):
        """Initialize MongoDB user repository"""
        self.collection = collection or database.database.users
    
    async def create(self, user: User) -> User:
        """Create a new user"""
        user_dict = user.model_dump(exclude={"id"})
        user_dict["created_at"] = datetime.now(timezone.utc)
        
        result = await self.collection.insert_one(user_dict)
        
        user.id = str(result.inserted_id)
        user.created_at = user_dict["created_at"]
        
        return user
    
    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        try:
            user_doc = await self.collection.find_one({"_id": ObjectId(user_id)})
            if user_doc:
                return self._document_to_user(user_doc)
            return None
        except Exception:
            return None
    
    async def get_paginated(self, skip: int = 0, limit: int = 10) -> List[User]:
        """Get paginated users"""
        cursor = self.collection.find().sort("created_at", -1).skip(skip).limit(limit)
        users = []
        
        async for user_doc in cursor:
            users.append(self._document_to_user(user_doc))
        
        return users
    
    async def count(self) -> int:
        """Get total count of users"""
        return await self.collection.count_documents({})
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        user_doc = await self.collection.find_one({"email": email})
        if user_doc:
            return self._document_to_user(user_doc)
        return None
    
    def _document_to_user(self, user_doc: dict) -> User:
        """Convert MongoDB document to User entity"""
        user_doc["id"] = str(user_doc["_id"])
        user_doc.pop("_id", None)
        return User(**user_doc)
