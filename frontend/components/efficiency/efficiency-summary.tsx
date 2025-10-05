"use client"

import {
  EfficiencySummary,
  PERFORMANCE_GRADE_COLORS,
} from "@/types/v0/efficiency"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EfficiencySummaryProps {
  summary: EfficiencySummary
}

export default function EfficiencySummaryCards({
  summary,
}: EfficiencySummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatNumber = (num: number, unit: string) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(num) + ` ${unit}`
    )
  }

  const getPerformanceGradeColor = (grade: string) => {
    return (
      PERFORMANCE_GRADE_COLORS[
        grade as keyof typeof PERFORMANCE_GRADE_COLORS
      ] || PERFORMANCE_GRADE_COLORS.F
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Cost Savings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Cost Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(summary.total_cost_savings)}
          </div>
          <p className="text-xs text-muted-foreground">
            Electric: {formatCurrency(summary.total_electric_cost_savings)} |
            Gas: {formatCurrency(summary.total_gas_cost_savings)}
          </p>
        </CardContent>
      </Card>

      {/* Total Electric Savings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Electric Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(summary.total_electric_savings_kwh, "kWh")}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.average_electric_efficiency_improvement.toFixed(1)}%
            improvement
          </p>
        </CardContent>
      </Card>

      {/* Total Gas Savings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gas Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatNumber(summary.total_gas_savings_therms, "Therms")}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.average_gas_efficiency_improvement.toFixed(1)}% improvement
          </p>
        </CardContent>
      </Card>

      {/* Average Efficiency Improvement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Efficiency Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {summary.overall_efficiency_improvement.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Overall efficiency gain
          </p>
        </CardContent>
      </Card>

      {/* Performance Grade */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Performance Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={`text-lg font-bold px-3 py-1 ${getPerformanceGradeColor(summary.performance_grade)}`}
            >
              {summary.performance_grade}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on {summary.overall_efficiency_improvement.toFixed(1)}%
            improvement
          </p>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Electric Savings:</span>
              <span className="font-medium">
                {formatCurrency(summary.total_electric_cost_savings)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gas Savings:</span>
              <span className="font-medium">
                {formatCurrency(summary.total_gas_cost_savings)}
              </span>
            </div>
            <div className="border-t pt-1 flex justify-between text-sm font-bold">
              <span>Total:</span>
              <span>{formatCurrency(summary.total_cost_savings)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
