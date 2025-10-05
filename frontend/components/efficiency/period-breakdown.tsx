"use client"

import {
  PERFORMANCE_GRADE_COLORS,
  PeriodEfficiencyMetrics,
} from "@/types/v0/efficiency"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PeriodBreakdownProps {
  periods: PeriodEfficiencyMetrics[]
}

export default function PeriodBreakdown({ periods }: PeriodBreakdownProps) {
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

  const getPerformanceColor = (improvement: number) => {
    if (improvement >= 15) return "text-green-600 bg-green-50 border-green-200"
    if (improvement >= 10) return "text-blue-600 bg-blue-50 border-blue-200"
    if (improvement >= 5)
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (improvement >= 0)
      return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getPerformanceLabel = (improvement: number) => {
    if (improvement >= 15) return "Excellent"
    if (improvement >= 10) return "Good"
    if (improvement >= 5) return "Fair"
    if (improvement >= 0) return "Needs Improvement"
    return "Poor"
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Period Breakdown</h3>
        <p className="text-sm text-muted-foreground">
          Detailed efficiency metrics for each operational period
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {periods.map((period, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base capitalize">
                  {period.period.replace("_", " ")}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={getPerformanceColor(
                    period.overall_efficiency_improvement
                  )}
                >
                  {getPerformanceLabel(period.overall_efficiency_improvement)}
                </Badge>
              </div>
              <CardDescription>
                {period.time_range} • {period.days.join(", ")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Energy Savings */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Energy Savings
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Electric:</span>
                    <span className="font-medium text-blue-600">
                      {formatNumber(period.electric_savings_kwh, "kWh")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas:</span>
                    <span className="font-medium text-orange-600">
                      {formatNumber(period.gas_savings_therms, "Therms")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Savings */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Cost Savings
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Electric:</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(period.electric_cost_savings)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas:</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(period.gas_cost_savings)}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatCurrency(period.total_cost_savings)}
                  </span>
                </div>
              </div>

              {/* Efficiency Improvements */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Efficiency Improvements
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Electric:</span>
                    <span className="font-medium">
                      {period.electric_efficiency_improvement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas:</span>
                    <span className="font-medium">
                      {period.gas_efficiency_improvement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-medium">Overall:</span>
                    <span className="font-bold text-lg">
                      {period.overall_efficiency_improvement.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
