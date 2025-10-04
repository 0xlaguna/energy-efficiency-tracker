from pymongo import AsyncMongoClient
from pymongo.database import Database as PyMongoDatabase

from app.infrastructure.config import settings


class Database:
    """Database connection manager"""
    
    def __init__(self):
        """Initialize database connection"""
        self.client: AsyncMongoClient = None
        self.database: PyMongoDatabase = None
    
    async def connect(self):
        """Connect to MongoDB"""
        self.client = AsyncMongoClient(settings.mongodb_url)
        self.database = self.client[settings.mongodb_database]
        
        # Create indexes
        await self._create_indexes()
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            await self.client.close()
    
    async def _create_indexes(self):
        """Create database indexes"""
        await self.database.users.create_index("email", unique=True)
        await self.database.users.create_index("created_at")


database = Database()
