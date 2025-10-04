from abc import ABC, abstractmethod
from typing import Optional


class CacheService(ABC):
    """Port for cache operations"""
    
    @abstractmethod
    async def get(self, key: str) -> Optional[str]:
        """Get value from cache"""
        pass
    
    @abstractmethod
    async def set(self, key: str, value: str, ttl: int = 60) -> None:
        """Set value in cache with TTL"""
        pass
    
    @abstractmethod
    async def delete(self, key: str) -> None:
        """Delete value from cache"""
        pass
    
    @abstractmethod
    async def delete_pattern(self, pattern: str) -> None:
        """Delete all keys matching pattern"""
        pass
