from typing import List, Optional
import json

from app.domain.entities.efficiency import (
    EfficiencyCalculation, 
    PeriodData, 
    PeriodEfficiencyMetrics, 
    EfficiencySummary,
    BuildingEfficiencySummary
)
from app.domain.ports.efficiency_repository import EfficiencyRepository
from app.domain.ports.cache_service import CacheService
from app.infrastructure.logging import get_logger

logger = get_logger(__name__)


class EfficiencyService:
    """Efficiency calculation application service with Redis caching"""

    def __init__(self, efficiency_repository: EfficiencyRepository, cache_service: CacheService):
        """Initialize efficiency service with dependencies"""
        self.efficiency_repository = efficiency_repository
        self.cache_service = cache_service
        self._cache_ttl = 300  # 5 minutes

    async def calculate_efficiency(
        self, 
        building_id: str, 
        measure_name: str, 
        periods: List[PeriodData]
    ) -> EfficiencyCalculation:
        """Calculate efficiency metrics for all periods"""
        
        # Period metrics
        period_metrics = self._calculate_period_metrics(periods)
        
        # Calculate summary
        summary = self._calculate_summary(period_metrics)
        
        # Create efficiency calculation
        calculation = EfficiencyCalculation(
            building_id=building_id,
            measure_name=measure_name,
            periods=period_metrics,
            summary=summary
        )
        
        # Save to repository
        return await self.efficiency_repository.create(calculation)

    def _calculate_period_metrics(self, period_data: PeriodData) -> PeriodEfficiencyMetrics:
        """Calculate efficiency metrics for a single period"""
        
        # Energy savings
        electric_savings = period_data.baseline_electric_kwh - period_data.current_electric_kwh
        gas_savings = period_data.baseline_gas_therms - period_data.current_gas_therms
        
        # Cost savings
        electric_cost_savings = electric_savings * period_data.electric_rate
        gas_cost_savings = gas_savings * period_data.gas_rate
        total_cost_savings = electric_cost_savings + gas_cost_savings
        
        # Efficiency improvements (percentage)
        electric_efficiency_improvement = (
            (electric_savings / period_data.baseline_electric_kwh) * 100
            if period_data.baseline_electric_kwh > 0 else 0
        )
        gas_efficiency_improvement = (
            (gas_savings / period_data.baseline_gas_therms) * 100
            if period_data.baseline_gas_therms > 0 else 0
        )
        
        # Overall efficiency improvement (weighted average)
        total_baseline_energy = period_data.baseline_electric_kwh + period_data.baseline_gas_therms
        total_current_energy = period_data.current_electric_kwh + period_data.current_gas_therms
        overall_efficiency_improvement = (
            ((total_baseline_energy - total_current_energy) / total_baseline_energy) * 100
            if total_baseline_energy > 0 else 0
        )
        
        return PeriodEfficiencyMetrics(
            period=period_data.period,
            time_range=period_data.time_range,
            days=period_data.days,
            electric_savings_kwh=electric_savings,
            gas_savings_therms=gas_savings,
            electric_cost_savings=electric_cost_savings,
            gas_cost_savings=gas_cost_savings,
            total_cost_savings=total_cost_savings,
            electric_efficiency_improvement=electric_efficiency_improvement,
            gas_efficiency_improvement=gas_efficiency_improvement,
            overall_efficiency_improvement=overall_efficiency_improvement
        )

    def _calculate_period_metrics(self, periods: List[PeriodData]) -> List[PeriodEfficiencyMetrics]:
        """Calculation for all periods at once"""
        
        # Extract all values into arrays
        baseline_electric = [p.baseline_electric_kwh for p in periods]
        current_electric = [p.current_electric_kwh for p in periods]
        baseline_gas = [p.baseline_gas_therms for p in periods]
        current_gas = [p.current_gas_therms for p in periods]
        electric_rates = [p.electric_rate for p in periods]
        gas_rates = [p.gas_rate for p in periods]
        
        electric_savings = [b - c for b, c in zip(baseline_electric, current_electric)]
        gas_savings = [b - c for b, c in zip(baseline_gas, current_gas)]
        
        electric_cost_savings = [s * r for s, r in zip(electric_savings, electric_rates)]
        gas_cost_savings = [s * r for s, r in zip(gas_savings, gas_rates)]
        total_cost_savings = [e + g for e, g in zip(electric_cost_savings, gas_cost_savings)]
        
        # Efficiency calculations
        electric_efficiency = [
            (s / b) * 100 if b > 0 else 0 
            for s, b in zip(electric_savings, baseline_electric)
        ]
        gas_efficiency = [
            (s / b) * 100 if b > 0 else 0 
            for s, b in zip(gas_savings, baseline_gas)
        ]
        
        # Overall efficiency (weighted by total energy)
        total_baseline = [b_e + b_g for b_e, b_g in zip(baseline_electric, baseline_gas)]
        total_current = [c_e + c_g for c_e, c_g in zip(current_electric, current_gas)]
        overall_efficiency = [
            ((b - c) / b) * 100 if b > 0 else 0 
            for b, c in zip(total_baseline, total_current)
        ]
        
        # Create PeriodEfficiencyMetrics objects
        period_metrics = []
        for i, period in enumerate(periods):
            period_metrics.append(PeriodEfficiencyMetrics(
                period=period.period,
                time_range=period.time_range,
                days=period.days,
                electric_savings_kwh=electric_savings[i],
                gas_savings_therms=gas_savings[i],
                electric_cost_savings=electric_cost_savings[i],
                gas_cost_savings=gas_cost_savings[i],
                total_cost_savings=total_cost_savings[i],
                electric_efficiency_improvement=electric_efficiency[i],
                gas_efficiency_improvement=gas_efficiency[i],
                overall_efficiency_improvement=overall_efficiency[i]
            ))
        
        return period_metrics

    def _calculate_summary(self, period_metrics: List[PeriodEfficiencyMetrics]) -> EfficiencySummary:
        """Calculate aggregated summary from all period metrics"""
        
        # Aggregate totals
        total_electric_savings = sum(metric.electric_savings_kwh for metric in period_metrics)
        total_gas_savings = sum(metric.gas_savings_therms for metric in period_metrics)
        total_electric_cost_savings = sum(metric.electric_cost_savings for metric in period_metrics)
        total_gas_cost_savings = sum(metric.gas_cost_savings for metric in period_metrics)
        total_cost_savings = sum(metric.total_cost_savings for metric in period_metrics)
        
        # Calculate averages
        electric_improvements = [metric.electric_efficiency_improvement for metric in period_metrics]
        gas_improvements = [metric.gas_efficiency_improvement for metric in period_metrics]
        overall_improvements = [metric.overall_efficiency_improvement for metric in period_metrics]
        
        average_electric_improvement = (
            sum(electric_improvements) / len(electric_improvements)
            if electric_improvements else 0
        )
        average_gas_improvement = (
            sum(gas_improvements) / len(gas_improvements)
            if gas_improvements else 0
        )
        overall_efficiency_improvement = (
            sum(overall_improvements) / len(overall_improvements)
            if overall_improvements else 0
        )
        
        # Calculate performance grade
        performance_grade = self._calculate_performance_grade(overall_efficiency_improvement)
        
        return EfficiencySummary(
            total_electric_savings_kwh=total_electric_savings,
            total_gas_savings_therms=total_gas_savings,
            total_electric_cost_savings=total_electric_cost_savings,
            total_gas_cost_savings=total_gas_cost_savings,
            total_cost_savings=total_cost_savings,
            average_electric_efficiency_improvement=average_electric_improvement,
            average_gas_efficiency_improvement=average_gas_improvement,
            overall_efficiency_improvement=overall_efficiency_improvement,
            performance_grade=performance_grade
        )

    def _calculate_performance_grade(self, efficiency_improvement: float) -> str:
        """Calculate performance grade based on efficiency"""
        if efficiency_improvement >= 25:
            return "A"
        elif efficiency_improvement >= 15:
            return "B"
        elif efficiency_improvement >= 10:
            return "C"
        elif efficiency_improvement >= 5:
            return "D"
        else:
            return "F"

    async def get_building_calculations(self, building_id: str) -> List[EfficiencyCalculation]:
        """Get all efficiency calculations for a building with Redis caching"""
        cache_key = f"efficiency:building_calculations:{building_id}"
        
        cached_data = await self.cache_service.get(cache_key)
        if cached_data:
            try:
                calculations_data = json.loads(cached_data)
                logger.info("Getting building calculations from cache")
                return [EfficiencyCalculation(**calc) for calc in calculations_data]
            except Exception as e:
                logger.error(f"Error deserializing building calculations: {e}") 
        
        calculations = await self.efficiency_repository.get_by_building_id(building_id)
        
        # Cache in Redis
        try:
            calculations_data = [calc.model_dump(mode='json') for calc in calculations]
            await self.cache_service.set(cache_key, json.dumps(calculations_data), self._cache_ttl)
        except Exception as e:
            logger.error(f"Error caching building calculations: {e}")
        
        return calculations

    async def get_building_calculations_by_period(
        self, 
        building_id: str, 
        period: str
    ) -> List[EfficiencyCalculation]:
        """Get efficiency calculations for a building and specific period with Redis caching"""
        cache_key = f"efficiency:building_period:{building_id}:{period}"
        
        cached_data = await self.cache_service.get(cache_key)
        if cached_data:
            try:
                calculations_data = json.loads(cached_data)
                return [EfficiencyCalculation(**calc) for calc in calculations_data]
            except Exception as e:
                logger.error(f"Error deserializing building calculations: {e}")
        
        # Get from database
        calculations = await self.efficiency_repository.get_by_building_and_period(building_id, period)
        
        try:
            calculations_data = [calc.model_dump(mode='json') for calc in calculations]
            await self.cache_service.set(cache_key, json.dumps(calculations_data), self._cache_ttl)
        except Exception as e:
            logger.error(f"Error caching building calculations: {e}")
        
        return calculations

    async def get_building_summary(self, building_id: str) -> Optional[BuildingEfficiencySummary]:
        """Get building efficiency summary with Redis caching"""
        cache_key = f"efficiency:building_summary:{building_id}"
        
        cached_data = await self.cache_service.get(cache_key)
        if cached_data:
            try:
                summary_data = json.loads(cached_data)
                return BuildingEfficiencySummary(**summary_data)
            except Exception as e:
                logger.error(f"Error deserializing building summary: {e}")
        
        # Get from database
        summary = await self.efficiency_repository.get_building_summary(building_id)
        
        # Cache in Redis
        if summary:
            try:
                await self.cache_service.set(cache_key, json.dumps(summary.model_dump(mode='json')), self._cache_ttl)
            except Exception as e:
                logger.error(f"Error caching building summary: {e}")
        
        return summary

    async def get_latest_calculation(self, building_id: str) -> Optional[EfficiencyCalculation]:
        """Get the latest efficiency calculation for a building with Redis caching"""
        cache_key = f"efficiency:latest_calculation:{building_id}"
        
        cached_data = await self.cache_service.get(cache_key)
        if cached_data:
            try:
                calculation_data = json.loads(cached_data)
                return EfficiencyCalculation(**calculation_data)
            except Exception as e:
                logger.error(f"Error deserializing latest calculation: {e}")
        
        calculation = await self.efficiency_repository.get_latest_by_building_id(building_id)
        
        # Cache in Redis
        if calculation:
            try:
                await self.cache_service.set(cache_key, json.dumps(calculation.model_dump(mode='json')), self._cache_ttl)
            except Exception as e:
                logger.error(f"Error caching latest calculation: {e}")

        return calculation

    async def clear_cache(self, building_id: str = None):
        """Clear cached data for a building or all efficiency data"""
        if building_id:
            # Clear specific building cache
            patterns = [
                f"efficiency:building_calculations:{building_id}",
                f"efficiency:building_summary:{building_id}",
                f"efficiency:latest_calculation:{building_id}",
                f"efficiency:building_period:{building_id}:*"
            ]
            for pattern in patterns:
                await self.cache_service.delete_pattern(pattern)
        else:
            # Clear all efficiency cache
            await self.cache_service.delete_pattern("efficiency:*")
