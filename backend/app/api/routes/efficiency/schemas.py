from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# Request Schemas
class PeriodDataRequest(BaseModel):
    """Period data request schema"""
    period: str = Field(..., description="Period name (e.g., 'business_hours', 'after_hours', 'weekend')")
    time_range: str = Field(..., description="Time range (e.g., '08:00-18:00')")
    days: List[str] = Field(..., description="Days of the week")
    current_electric_kwh: float = Field(..., gt=0, description="Current electric consumption in kWh")
    current_gas_therms: float = Field(..., gt=0, description="Current gas consumption in therms")
    baseline_electric_kwh: float = Field(..., gt=0, description="Baseline electric consumption in kWh")
    baseline_gas_therms: float = Field(..., gt=0, description="Baseline gas consumption in therms")
    electric_rate: float = Field(..., gt=0, description="Electric rate per kWh")
    gas_rate: float = Field(..., gt=0, description="Gas rate per therm")


class CalculateEfficiencyRequest(BaseModel):
    """Request schema for efficiency calculation"""
    building_id: str = Field(..., description="Building identifier")
    measure_name: str = Field(..., description="Energy efficiency measure name")
    periods: List[PeriodDataRequest] = Field(..., min_items=1, description="Period data for calculations")


# Response Schemas
class PeriodEfficiencyMetricsResponse(BaseModel):
    """Period efficiency metrics response schema"""
    period: str
    time_range: str
    days: List[str]
    electric_savings_kwh: float = Field(..., description="Electric energy savings in kWh")
    gas_savings_therms: float = Field(..., description="Gas energy savings in therms")
    electric_cost_savings: float = Field(..., description="Electric cost savings")
    gas_cost_savings: float = Field(..., description="Gas cost savings")
    total_cost_savings: float = Field(..., description="Total cost savings")
    electric_efficiency_improvement: float = Field(..., description="Electric efficiency improvement percentage")
    gas_efficiency_improvement: float = Field(..., description="Gas efficiency improvement percentage")
    overall_efficiency_improvement: float = Field(..., description="Overall efficiency improvement percentage")


class EfficiencySummaryResponse(BaseModel):
    """Efficiency summary response schema"""
    total_electric_savings_kwh: float = Field(..., description="Total electric savings in kWh")
    total_gas_savings_therms: float = Field(..., description="Total gas savings in therms")
    total_electric_cost_savings: float = Field(..., description="Total electric cost savings")
    total_gas_cost_savings: float = Field(..., description="Total gas cost savings")
    total_cost_savings: float = Field(..., description="Total cost savings")
    average_electric_efficiency_improvement: float = Field(..., description="Average electric efficiency improvement")
    average_gas_efficiency_improvement: float = Field(..., description="Average gas efficiency improvement")
    overall_efficiency_improvement: float = Field(..., description="Overall efficiency improvement")
    performance_grade: str = Field(..., description="Performance grade (A, B, C, D, F)")


class CalculateEfficiencyResponse(BaseModel):
    """Response schema for efficiency calculation"""
    id: str = Field(..., description="Calculation ID")
    building_id: str = Field(..., description="Building identifier")
    measure_name: str = Field(..., description="Energy efficiency measure name")
    calculation_timestamp: datetime = Field(..., description="When the calculation was performed")
    periods: List[PeriodEfficiencyMetricsResponse] = Field(..., description="Efficiency metrics for each period")
    summary: EfficiencySummaryResponse = Field(..., description="Aggregated summary of all periods")
    created_at: datetime = Field(..., description="When the calculation was created")


class BuildingEfficiencySummaryResponse(BaseModel):
    """Building efficiency summary response schema"""
    building_id: str
    total_calculations: int
    latest_calculation: Optional[CalculateEfficiencyResponse] = None
    best_performance_grade: Optional[str] = None
    average_efficiency_improvement: Optional[float] = None
    total_cost_savings: Optional[float] = None
    created_at: datetime


class BuildingCalculationsResponse(BaseModel):
    """Response schema for building calculations"""
    building_id: str
    calculations: List[CalculateEfficiencyResponse]
    total_count: int


class AllBuildingsSummaryResponse(BaseModel):
    """All buildings summary response schema"""
    
    buildings: List[BuildingEfficiencySummaryResponse] = Field(..., description="List of building summaries")
    total_buildings: int = Field(..., description="Total number of buildings")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Number of items per page")
    total_pages: int = Field(..., description="Total number of pages")
    has_next: bool = Field(..., description="Whether there is a next page")
    has_prev: bool = Field(..., description="Whether there is a previous page")


class ErrorResponse(BaseModel):
    """Error response schema"""
    detail: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
