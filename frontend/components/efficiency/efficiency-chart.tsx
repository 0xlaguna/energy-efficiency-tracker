"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { PeriodEfficiencyMetrics } from "@/types/v0/efficiency"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EfficiencyChartProps {
  periods: PeriodEfficiencyMetrics[]
  chartType: "bar" | "pie"
}

const COLORS = {
  electric: "#3b82f6", // blue
  gas: "#f97316", // orange
  total: "#10b981", // green
}

export default function EfficiencyChart({
  periods,
  chartType,
}: EfficiencyChartProps) {
  // Prepare data for bar chart
  const barChartData = periods.map((period) => ({
    period: period.period
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    electric: period.electric_efficiency_improvement,
    gas: period.gas_efficiency_improvement,
    total: period.overall_efficiency_improvement,
  }))

  // Prepare data for pie chart
  const pieChartData = periods.map((period) => ({
    name: period.period
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    value: period.total_cost_savings,
    color: COLORS.total,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartType === "bar") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Efficiency Improvements by Period</CardTitle>
          <CardDescription>
            Compare efficiency improvements across different operational periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis
                  label={{
                    value: "Efficiency Improvement (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="electric"
                  fill={COLORS.electric}
                  name="Electric"
                />
                <Bar dataKey="gas" fill={COLORS.gas} name="Gas" />
                <Bar dataKey="total" fill={COLORS.total} name="Overall" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartType === "pie") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Savings Distribution</CardTitle>
          <CardDescription>
            Proportion of cost savings by operational period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Cost Savings",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
