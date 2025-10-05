from typing import Optional

import redis.asyncio as redis

from app.domain.ports.cache_service import CacheService
from app.infrastructure.config import settings


class RedisCacheService(CacheService):
    """Redis implementation of CacheService"""
    
    def __init__(self):
        """Initialize Redis cache service"""
        self.redis_client: Optional[redis.Redis] = None
    
    async def connect(self):
        """Connect to Redis"""
        self.redis_client = redis.from_url(settings.redis_url)
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis_client:
            await self.redis_client.close()
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from cache"""
        if not self.redis_client:
            return None
        
        try:
            return await self.redis_client.get(key)
        except Exception:
            return None
    
    async def set(self, key: str, value: str, ttl: int = 60) -> None:
        """Set value in cache with TTL"""
        if not self.redis_client:
            return
        
        try:
            await self.redis_client.setex(key, ttl, value)
        except Exception:
            pass
    
    async def delete(self, key: str) -> None:
        """Delete value from cache"""
        if not self.redis_client:
            return
        
        try:
            await self.redis_client.delete(key)
        except Exception:
            pass
    
    async def delete_pattern(self, pattern: str) -> None:
        """Delete all keys matching pattern"""
        if not self.redis_client:
            return
        
        try:
            keys = await self.redis_client.keys(pattern)
            if keys:
                await self.redis_client.delete(*keys)
        except Exception:
            pass


cache_service = RedisCacheService()
