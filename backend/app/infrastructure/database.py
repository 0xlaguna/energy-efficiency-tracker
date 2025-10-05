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
        
        # Auth users indexes
        await self.database.auth_users.create_index("email", unique=True)
        await self.database.auth_users.create_index("created_at")
        await self.database.auth_users.create_index("is_active")
        
        # Efficiency calculations indexes
        await self.database.efficiency_calculations.create_index("building_id")
        await self.database.efficiency_calculations.create_index("created_at")
        
        # Compound indexes for common queries
        await self.database.efficiency_calculations.create_index([
            ("building_id", 1), ("created_at", -1)
        ])
        await self.database.efficiency_calculations.create_index([
            ("building_id", 1), ("periods.period", 1), ("created_at", -1)
        ])
        
        # Partial index for high-performance calculations (A and B grades)
        await self.database.efficiency_calculations.create_index(
            [("building_id", 1), ("summary.performance_grade", 1)],
            partialFilterExpression={"summary.performance_grade": {"$in": ["A", "B"]}}
        )
        
        # Sparse index for measure names (only when present)
        await self.database.efficiency_calculations.create_index(
            [("building_id", 1), ("measure_name", 1)],
            sparse=True
        )


database = Database()
