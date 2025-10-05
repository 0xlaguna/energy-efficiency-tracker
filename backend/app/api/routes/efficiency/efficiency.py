from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_efficiency_service
from app.application.services.efficiency_service import EfficiencyService
from app.domain.entities.efficiency import PeriodData
from app.domain.entities.auth import AuthUser
from app.api.middleware.auth import get_current_user
from app.api.routes.efficiency.schemas import (
    CalculateEfficiencyRequest,
    CalculateEfficiencyResponse,
    BuildingEfficiencySummaryResponse,
    BuildingCalculationsResponse,
    PeriodEfficiencyMetricsResponse,
    EfficiencySummaryResponse
)

router = APIRouter(prefix="/efficiency", tags=["efficiency"])


@router.post("/calculate", response_model=CalculateEfficiencyResponse, status_code=status.HTTP_201_CREATED)
async def calculate_efficiency(
    request: CalculateEfficiencyRequest,
    current_user: AuthUser = Depends(get_current_user),
    efficiency_service: EfficiencyService = Depends(get_efficiency_service),
):
    """Calculate energy efficiency metrics for a building"""
    try:
        # Convert request periods to domain entities
        periods = [
            PeriodData(
                period=period.period,
                time_range=period.time_range,
                days=period.days,
                current_electric_kwh=period.current_electric_kwh,
                current_gas_therms=period.current_gas_therms,
                baseline_electric_kwh=period.baseline_electric_kwh,
                baseline_gas_therms=period.baseline_gas_therms,
                electric_rate=period.electric_rate,
                gas_rate=period.gas_rate
            )
            for period in request.periods
        ]
        
        # Calculate efficiency
        calculation = await efficiency_service.calculate_efficiency(
            building_id=request.building_id,
            measure_name=request.measure_name,
            periods=periods
        )
        
        # Convert to response format
        period_responses = [
            PeriodEfficiencyMetricsResponse(
                period=period.period,
                time_range=period.time_range,
                days=period.days,
                electric_savings_kwh=period.electric_savings_kwh,
                gas_savings_therms=period.gas_savings_therms,
                electric_cost_savings=period.electric_cost_savings,
                gas_cost_savings=period.gas_cost_savings,
                total_cost_savings=period.total_cost_savings,
                electric_efficiency_improvement=period.electric_efficiency_improvement,
                gas_efficiency_improvement=period.gas_efficiency_improvement,
                overall_efficiency_improvement=period.overall_efficiency_improvement
            )
            for period in calculation.periods
        ]
        
        summary_response = EfficiencySummaryResponse(
            total_electric_savings_kwh=calculation.summary.total_electric_savings_kwh,
            total_gas_savings_therms=calculation.summary.total_gas_savings_therms,
            total_electric_cost_savings=calculation.summary.total_electric_cost_savings,
            total_gas_cost_savings=calculation.summary.total_gas_cost_savings,
            total_cost_savings=calculation.summary.total_cost_savings,
            average_electric_efficiency_improvement=calculation.summary.average_electric_efficiency_improvement,
            average_gas_efficiency_improvement=calculation.summary.average_gas_efficiency_improvement,
            overall_efficiency_improvement=calculation.summary.overall_efficiency_improvement,
            performance_grade=calculation.summary.performance_grade
        )
        
        return CalculateEfficiencyResponse(
            id=calculation.id,
            building_id=calculation.building_id,
            measure_name=calculation.measure_name,
            calculation_timestamp=calculation.calculation_timestamp,
            periods=period_responses,
            summary=summary_response,
            created_at=calculation.created_at
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid input data: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate efficiency: {str(e)}"
        )


@router.get("/building/{building_id}", response_model=BuildingCalculationsResponse)
async def get_building_calculations(
    building_id: str,
    current_user: AuthUser = Depends(get_current_user),
    efficiency_service: EfficiencyService = Depends(get_efficiency_service),
):
    """Get all efficiency calculations for a building"""
    try:
        calculations = await efficiency_service.get_building_calculations(building_id)
        
        # Convert to response format
        calculation_responses = []
        for calculation in calculations:
            period_responses = [
                PeriodEfficiencyMetricsResponse(
                    period=period.period,
                    time_range=period.time_range,
                    days=period.days,
                    electric_savings_kwh=period.electric_savings_kwh,
                    gas_savings_therms=period.gas_savings_therms,
                    electric_cost_savings=period.electric_cost_savings,
                    gas_cost_savings=period.gas_cost_savings,
                    total_cost_savings=period.total_cost_savings,
                    electric_efficiency_improvement=period.electric_efficiency_improvement,
                    gas_efficiency_improvement=period.gas_efficiency_improvement,
                    overall_efficiency_improvement=period.overall_efficiency_improvement
                )
                for period in calculation.periods
            ]
            
            summary_response = EfficiencySummaryResponse(
                total_electric_savings_kwh=calculation.summary.total_electric_savings_kwh,
                total_gas_savings_therms=calculation.summary.total_gas_savings_therms,
                total_electric_cost_savings=calculation.summary.total_electric_cost_savings,
                total_gas_cost_savings=calculation.summary.total_gas_cost_savings,
                total_cost_savings=calculation.summary.total_cost_savings,
                average_electric_efficiency_improvement=calculation.summary.average_electric_efficiency_improvement,
                average_gas_efficiency_improvement=calculation.summary.average_gas_efficiency_improvement,
                overall_efficiency_improvement=calculation.summary.overall_efficiency_improvement,
                performance_grade=calculation.summary.performance_grade
            )
            
            calculation_response = CalculateEfficiencyResponse(
                id=calculation.id,
                building_id=calculation.building_id,
                measure_name=calculation.measure_name,
                calculation_timestamp=calculation.calculation_timestamp,
                periods=period_responses,
                summary=summary_response,
                created_at=calculation.created_at
            )
            calculation_responses.append(calculation_response)
        
        return BuildingCalculationsResponse(
            building_id=building_id,
            calculations=calculation_responses,
            total_count=len(calculation_responses)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get building calculations: {str(e)}"
        )


@router.get("/building/{building_id}/period/{period}", response_model=BuildingCalculationsResponse)
async def get_building_calculations_by_period(
    building_id: str,
    period: str,
    current_user: AuthUser = Depends(get_current_user),
    efficiency_service: EfficiencyService = Depends(get_efficiency_service),
):
    """Get efficiency calculations for a building and specific period"""
    try:
        calculations = await efficiency_service.get_building_calculations_by_period(
            building_id, period
        )
        
        # Convert to response format (same as above)
        calculation_responses = []
        for calculation in calculations:
            period_responses = [
                PeriodEfficiencyMetricsResponse(
                    period=period.period,
                    time_range=period.time_range,
                    days=period.days,
                    electric_savings_kwh=period.electric_savings_kwh,
                    gas_savings_therms=period.gas_savings_therms,
                    electric_cost_savings=period.electric_cost_savings,
                    gas_cost_savings=period.gas_cost_savings,
                    total_cost_savings=period.total_cost_savings,
                    electric_efficiency_improvement=period.electric_efficiency_improvement,
                    gas_efficiency_improvement=period.gas_efficiency_improvement,
                    overall_efficiency_improvement=period.overall_efficiency_improvement
                )
                for period in calculation.periods
            ]
            
            summary_response = EfficiencySummaryResponse(
                total_electric_savings_kwh=calculation.summary.total_electric_savings_kwh,
                total_gas_savings_therms=calculation.summary.total_gas_savings_therms,
                total_electric_cost_savings=calculation.summary.total_electric_cost_savings,
                total_gas_cost_savings=calculation.summary.total_gas_cost_savings,
                total_cost_savings=calculation.summary.total_cost_savings,
                average_electric_efficiency_improvement=calculation.summary.average_electric_efficiency_improvement,
                average_gas_efficiency_improvement=calculation.summary.average_gas_efficiency_improvement,
                overall_efficiency_improvement=calculation.summary.overall_efficiency_improvement,
                performance_grade=calculation.summary.performance_grade
            )
            
            calculation_response = CalculateEfficiencyResponse(
                id=calculation.id,
                building_id=calculation.building_id,
                measure_name=calculation.measure_name,
                calculation_timestamp=calculation.calculation_timestamp,
                periods=period_responses,
                summary=summary_response,
                created_at=calculation.created_at
            )
            calculation_responses.append(calculation_response)
        
        return BuildingCalculationsResponse(
            building_id=building_id,
            calculations=calculation_responses,
            total_count=len(calculation_responses)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get building calculations for period: {str(e)}"
        )


@router.get("/building/{building_id}/summary", response_model=BuildingEfficiencySummaryResponse)
async def get_building_summary(
    building_id: str,
    current_user: AuthUser = Depends(get_current_user),
    efficiency_service: EfficiencyService = Depends(get_efficiency_service),
):
    """Get building efficiency summary"""
    try:
        summary = await efficiency_service.get_building_summary(building_id)
        
        if not summary:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No efficiency calculations found for building {building_id}"
            )
        
        # Convert latest calculation if exists
        latest_calculation_response = None
        if summary.latest_calculation:
            period_responses = [
                PeriodEfficiencyMetricsResponse(
                    period=period.period,
                    time_range=period.time_range,
                    days=period.days,
                    electric_savings_kwh=period.electric_savings_kwh,
                    gas_savings_therms=period.gas_savings_therms,
                    electric_cost_savings=period.electric_cost_savings,
                    gas_cost_savings=period.gas_cost_savings,
                    total_cost_savings=period.total_cost_savings,
                    electric_efficiency_improvement=period.electric_efficiency_improvement,
                    gas_efficiency_improvement=period.gas_efficiency_improvement,
                    overall_efficiency_improvement=period.overall_efficiency_improvement
                )
                for period in summary.latest_calculation.periods
            ]
            
            summary_response = EfficiencySummaryResponse(
                total_electric_savings_kwh=summary.latest_calculation.summary.total_electric_savings_kwh,
                total_gas_savings_therms=summary.latest_calculation.summary.total_gas_savings_therms,
                total_electric_cost_savings=summary.latest_calculation.summary.total_electric_cost_savings,
                total_gas_cost_savings=summary.latest_calculation.summary.total_gas_cost_savings,
                total_cost_savings=summary.latest_calculation.summary.total_cost_savings,
                average_electric_efficiency_improvement=summary.latest_calculation.summary.average_electric_efficiency_improvement,
                average_gas_efficiency_improvement=summary.latest_calculation.summary.average_gas_efficiency_improvement,
                overall_efficiency_improvement=summary.latest_calculation.summary.overall_efficiency_improvement,
                performance_grade=summary.latest_calculation.summary.performance_grade
            )
            
            latest_calculation_response = CalculateEfficiencyResponse(
                id=summary.latest_calculation.id,
                building_id=summary.latest_calculation.building_id,
                measure_name=summary.latest_calculation.measure_name,
                calculation_timestamp=summary.latest_calculation.calculation_timestamp,
                periods=period_responses,
                summary=summary_response,
                created_at=summary.latest_calculation.created_at
            )
        
        return BuildingEfficiencySummaryResponse(
            building_id=summary.building_id,
            total_calculations=summary.total_calculations,
            latest_calculation=latest_calculation_response,
            best_performance_grade=summary.best_performance_grade,
            average_efficiency_improvement=summary.average_efficiency_improvement,
            total_cost_savings=summary.total_cost_savings,
            created_at=summary.created_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get building summary: {str(e)}"
        )
