from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class PeriodData(BaseModel):
    """Period data for efficiency calculations"""
    
    period: str = Field(..., description="Period name (e.g., 'business_hours', 'after_hours', 'weekend')")
    time_range: str = Field(..., description="Time range (e.g., '08:00-18:00')")
    days: List[str] = Field(..., description="Days of the week")
    current_electric_kwh: float = Field(..., gt=0, description="Current electric consumption in kWh")
    current_gas_therms: float = Field(..., gt=0, description="Current gas consumption in therms")
    baseline_electric_kwh: float = Field(..., gt=0, description="Baseline electric consumption in kWh")
    baseline_gas_therms: float = Field(..., gt=0, description="Baseline gas consumption in therms")
    electric_rate: float = Field(..., gt=0, description="Electric rate per kWh")
    gas_rate: float = Field(..., gt=0, description="Gas rate per therm")


class PeriodEfficiencyMetrics(BaseModel):
    """Efficiency metrics for a specific period"""
    
    period: str
    time_range: str
    days: List[str]
    
    # Energy savings
    electric_savings_kwh: float = Field(..., description="Electric energy savings in kWh")
    gas_savings_therms: float = Field(..., description="Gas energy savings in therms")
    
    # Cost savings
    electric_cost_savings: float = Field(..., description="Electric cost savings")
    gas_cost_savings: float = Field(..., description="Gas cost savings")
    total_cost_savings: float = Field(..., description="Total cost savings")
    
    # Efficiency improvements
    electric_efficiency_improvement: float = Field(..., description="Electric efficiency improvement percentage")
    gas_efficiency_improvement: float = Field(..., description="Gas efficiency improvement percentage")
    overall_efficiency_improvement: float = Field(..., description="Overall efficiency improvement percentage")


class EfficiencySummary(BaseModel):
    """Summary of efficiency calculations"""
    
    total_electric_savings_kwh: float = Field(..., description="Total electric savings in kWh")
    total_gas_savings_therms: float = Field(..., description="Total gas savings in therms")
    total_electric_cost_savings: float = Field(..., description="Total electric cost savings")
    total_gas_cost_savings: float = Field(..., description="Total gas cost savings")
    total_cost_savings: float = Field(..., description="Total cost savings")
    average_electric_efficiency_improvement: float = Field(..., description="Average electric efficiency improvement")
    average_gas_efficiency_improvement: float = Field(..., description="Average gas efficiency improvement")
    overall_efficiency_improvement: float = Field(..., description="Overall efficiency improvement")
    performance_grade: str = Field(..., description="Performance grade (A, B, C, D, F)")


class EfficiencyCalculation(BaseModel):
    """Efficiency calculation domain entity"""
    
    id: Optional[str] = None
    building_id: str = Field(..., description="Building identifier")
    measure_name: str = Field(..., description="Energy efficiency measure name")
    calculation_timestamp: datetime = Field(default_factory=datetime.utcnow, description="When the calculation was performed")
    periods: List[PeriodEfficiencyMetrics] = Field(..., description="Efficiency metrics for each period")
    summary: EfficiencySummary = Field(..., description="Aggregated summary of all periods")
    created_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class BuildingEfficiencySummary(BaseModel):
    """Building efficiency summary for GET endpoints"""
    
    building_id: str
    total_calculations: int
    latest_calculation: Optional[EfficiencyCalculation] = None
    best_performance_grade: Optional[str] = None
    average_efficiency_improvement: Optional[float] = None
    total_cost_savings: Optional[float] = None
    created_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
