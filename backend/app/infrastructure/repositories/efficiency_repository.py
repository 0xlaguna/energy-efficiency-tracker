from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId

from app.domain.ports.efficiency_repository import EfficiencyRepository
from app.domain.entities.efficiency import EfficiencyCalculation, BuildingEfficiencySummary
from app.infrastructure.database import database


class MongodbEfficiencyRepository(EfficiencyRepository):
    """MongoDB implementation of EfficiencyRepository"""
    
    def __init__(self, collection=None):
        """Initialize MongoDB efficiency repository"""
        self.collection = collection or database.database.efficiency_calculations
    
    async def create(self, calculation: EfficiencyCalculation) -> EfficiencyCalculation:
        """Create a new efficiency calculation"""
        calculation_dict = calculation.model_dump(exclude={"id"})
        calculation_dict["created_at"] = datetime.now(timezone.utc)
        
        result = await self.collection.insert_one(calculation_dict)
        
        calculation.id = str(result.inserted_id)
        calculation.created_at = calculation_dict["created_at"]
        
        return calculation
    
    async def get_by_id(self, calculation_id: str) -> Optional[EfficiencyCalculation]:
        """Get efficiency calculation by ID"""
        try:
            calculation_doc = await self.collection.find_one({"_id": ObjectId(calculation_id)})
            if calculation_doc:
                return self._document_to_calculation(calculation_doc)
            return None
        except Exception:
            return None
    
    async def get_by_building_id(self, building_id: str) -> List[EfficiencyCalculation]:
        """Get all efficiency calculations for a building"""
        cursor = self.collection.find({"building_id": building_id}).sort("created_at", -1)
        calculations = []
        
        async for calculation_doc in cursor:
            calculations.append(self._document_to_calculation(calculation_doc))
        
        return calculations
    
    async def get_by_building_and_period(
        self, 
        building_id: str, 
        period: str
    ) -> List[EfficiencyCalculation]:
        """Get efficiency calculations for a building and specific period"""
        cursor = self.collection.find({
            "building_id": building_id,
            "periods.period": period
        }).sort("created_at", -1)
        
        calculations = []
        async for calculation_doc in cursor:
            calculations.append(self._document_to_calculation(calculation_doc))
        
        return calculations
    
    async def get_building_summary(self, building_id: str) -> Optional[BuildingEfficiencySummary]:
        """Get building efficiency summary using optimized aggregation pipeline"""
        
        # First, get the count separately to debug
        total_count = await self.collection.count_documents({"building_id": building_id})
        
        if total_count == 0:
            return None
        
        # Use MongoDB aggregation pipeline for efficient summary calculation
        pipeline = [
            {"$match": {"building_id": building_id}},
            {"$sort": {"created_at": -1}},
            {
                "$group": {
                    "_id": "$building_id",
                    "total_calculations": {"$sum": 1},
                    "latest_calculation": {"$first": "$$ROOT"},
                    "avg_efficiency_improvement": {"$avg": "$summary.overall_efficiency_improvement"},
                    "total_cost_savings": {"$sum": "$summary.total_cost_savings"},
                    "performance_grades": {"$push": "$summary.performance_grade"}
                }
            }
        ]
        
        cursor = await self.collection.aggregate(pipeline)
        result = await cursor.to_list(1)
        if not result:
            return None
        
        data = result[0]
        
        # Use the count from count_documents instead of aggregation
        data["total_calculations"] = total_count
        
        # Find best performance grade efficiently
        grade_order = {"A": 5, "B": 4, "C": 3, "D": 2, "F": 1}
        best_grade = max(data["performance_grades"], key=lambda g: grade_order.get(g, 0)) if data["performance_grades"] else None
        
        # Convert latest calculation document to entity
        latest_calculation = None
        if data["latest_calculation"]:
            latest_calculation = self._document_to_calculation(data["latest_calculation"])
        
        return BuildingEfficiencySummary(
            building_id=building_id,
            total_calculations=data["total_calculations"],
            latest_calculation=latest_calculation,
            best_performance_grade=best_grade,
            average_efficiency_improvement=data["avg_efficiency_improvement"],
            total_cost_savings=data["total_cost_savings"],
            created_at=datetime.now(timezone.utc)
        )
    
    async def get_latest_by_building_id(self, building_id: str) -> Optional[EfficiencyCalculation]:
        """Get the latest efficiency calculation for a building"""
        calculation_doc = await self.collection.find_one(
            {"building_id": building_id},
            sort=[("created_at", -1)]
        )
        
        if calculation_doc:
            return self._document_to_calculation(calculation_doc)
        return None
    
    async def count_by_building_id(self, building_id: str) -> int:
        """Get count of calculations for a building"""
        return await self.collection.count_documents({"building_id": building_id})
    
    async def get_all_buildings_summary(self, skip: int = 0, limit: int = 100) -> tuple[List[BuildingEfficiencySummary], int]:
        """Get summary for all buildings using optimized aggregation pipeline with pagination"""
        
        # First, get total count of unique buildings
        total_buildings = await self.collection.distinct("building_id")
        total_count = len(total_buildings)
        
        # Pipeline to get buildings with their summaries
        pipeline = [
            {"$sort": {"created_at": -1}},  # Sort by created_at descending first
            {
                "$group": {
                    "_id": "$building_id",
                    "total_calculations": {"$sum": 1},
                    "latest_calculation": {"$first": "$$ROOT"},  # Get the first (most recent) document
                    "avg_efficiency_improvement": {"$avg": "$summary.overall_efficiency_improvement"},
                    "total_cost_savings": {"$sum": "$summary.total_cost_savings"},
                    "performance_grades": {"$push": "$summary.performance_grade"},
                    "latest_measure_name": {"$first": "$measure_name"},
                    "latest_created_at": {"$first": "$created_at"}
                }
            },
            {"$sort": {"latest_created_at": -1}},
            {"$skip": skip},
            {"$limit": limit}
        ]
        
        cursor = await self.collection.aggregate(pipeline)
        results = await cursor.to_list(None)
        
        building_summaries = []
        for data in results:
            # Find best performance grade efficiently
            grade_order = {"A": 5, "B": 4, "C": 3, "D": 2, "F": 1}
            best_grade = max(data["performance_grades"], key=lambda g: grade_order.get(g, 0)) if data["performance_grades"] else None
            
            # Convert latest calculation document to entity
            latest_calculation = None
            if data["latest_calculation"]:
                latest_calculation = self._document_to_calculation(data["latest_calculation"])
            
            building_summaries.append(BuildingEfficiencySummary(
                building_id=data["_id"],
                total_calculations=data["total_calculations"],
                latest_calculation=latest_calculation,
                best_performance_grade=best_grade,
                average_efficiency_improvement=data["avg_efficiency_improvement"],
                total_cost_savings=data["total_cost_savings"],
                created_at=data["latest_created_at"]
            ))
        
        return building_summaries, total_count
    
    def _document_to_calculation(self, calculation_doc: dict) -> EfficiencyCalculation:
        """Convert MongoDB document to EfficiencyCalculation entity"""
        calculation_doc["id"] = str(calculation_doc["_id"])
        calculation_doc.pop("_id", None)
        return EfficiencyCalculation(**calculation_doc)
