export interface PeriodData {
  period: string
  time_range: string
  days: string[]
  current_electric_kwh: number
  current_gas_therms: number
  baseline_electric_kwh: number
  baseline_gas_therms: number
  electric_rate: number
  gas_rate: number
}

export interface CalculateEfficiencyRequest {
  building_id: string
  measure_name: string
  periods: PeriodData[]
}

export interface PeriodEfficiencyMetrics {
  period: string
  time_range: string
  days: string[]
  electric_savings_kwh: number
  gas_savings_therms: number
  electric_cost_savings: number
  gas_cost_savings: number
  total_cost_savings: number
  electric_efficiency_improvement: number
  gas_efficiency_improvement: number
  overall_efficiency_improvement: number
}

export interface EfficiencySummary {
  total_electric_savings_kwh: number
  total_gas_savings_therms: number
  total_electric_cost_savings: number
  total_gas_cost_savings: number
  total_cost_savings: number
  average_electric_efficiency_improvement: number
  average_gas_efficiency_improvement: number
  overall_efficiency_improvement: number
  performance_grade: string
}

export interface EfficiencyCalculation {
  id: string
  building_id: string
  measure_name: string
  calculation_timestamp: string
  periods: PeriodEfficiencyMetrics[]
  summary: EfficiencySummary
  created_at: string
}

export interface BuildingEfficiencySummary {
  building_id: string
  total_calculations: number
  latest_calculation?: EfficiencyCalculation
  best_performance_grade?: string
  average_efficiency_improvement?: number
  total_cost_savings?: number
  created_at: string
}

export interface BuildingCalculationsResponse {
  building_id: string
  calculations: EfficiencyCalculation[]
  total_count: number
}

export interface AllBuildingsSummaryResponse {
  buildings: BuildingEfficiencySummary[]
  total_buildings: number
  page: number
  limit: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// Form data types
export interface EfficiencyFormData {
  building_id: string
  measure_name: string
  periods: PeriodFormData[]
}

export interface PeriodFormData {
  period: string
  time_range: string
  days: string[]
  current_electric_kwh: number
  current_gas_therms: number
  baseline_electric_kwh: number
  baseline_gas_therms: number
  electric_rate: number
  gas_rate: number
}

// Performance grade colors
export const PERFORMANCE_GRADE_COLORS = {
  A: "text-green-600 bg-green-50 border-green-200",
  B: "text-blue-600 bg-blue-50 border-blue-200",
  C: "text-yellow-600 bg-yellow-50 border-yellow-200",
  D: "text-orange-600 bg-orange-50 border-orange-200",
  F: "text-red-600 bg-red-50 border-red-200",
} as const

export type PerformanceGrade = keyof typeof PERFORMANCE_GRADE_COLORS
