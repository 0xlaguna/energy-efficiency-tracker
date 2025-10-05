from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.efficiency import EfficiencyCalculation, BuildingEfficiencySummary


class EfficiencyRepository(ABC):
    """Port for efficiency repository operations"""
    
    @abstractmethod
    async def create(self, calculation: EfficiencyCalculation) -> EfficiencyCalculation:
        """Create a new efficiency calculation"""
        pass
    
    @abstractmethod
    async def get_by_id(self, calculation_id: str) -> Optional[EfficiencyCalculation]:
        """Get efficiency calculation by ID"""
        pass
    
    @abstractmethod
    async def get_by_building_id(self, building_id: str) -> List[EfficiencyCalculation]:
        """Get all efficiency calculations for a building"""
        pass
    
    @abstractmethod
    async def get_by_building_and_period(
        self, 
        building_id: str, 
        period: str
    ) -> List[EfficiencyCalculation]:
        """Get efficiency calculations for a building and specific period"""
        pass
    
    @abstractmethod
    async def get_building_summary(self, building_id: str) -> Optional[BuildingEfficiencySummary]:
        """Get building efficiency summary"""
        pass
    
    @abstractmethod
    async def get_latest_by_building_id(self, building_id: str) -> Optional[EfficiencyCalculation]:
        """Get the latest efficiency calculation for a building"""
        pass
    
    @abstractmethod
    async def count_by_building_id(self, building_id: str) -> int:
        """Get count of calculations for a building"""
        pass
