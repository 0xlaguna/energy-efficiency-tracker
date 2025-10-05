"use client"

import { useState } from "react"
import { ArrowLeft, Building2, DollarSign, TrendingUp } from "lucide-react"

import useBuildingCalculations from "@/hooks/data/useBuildingCalculations"
import useBuildingSummary from "@/hooks/data/useBuildingSummary"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import EfficiencyChart from "./efficiency-chart"
import EfficiencySummaryCards from "./efficiency-summary"
import PeriodBreakdown from "./period-breakdown"

interface BuildingDetailsProps {
  buildingId: string
  onBack: () => void
}

export default function BuildingDetails({
  buildingId,
  onBack,
}: BuildingDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const { buildingSummaryData, buildingSummaryLoading, buildingSummaryError } =
    useBuildingSummary(buildingId)

  const {
    buildingCalculationsError,
    buildingCalculationsErrorData,
    buildingCalculationsLoading,
    buildingCalculationsSuccess,
    buildingCalculationsData,
  } = useBuildingCalculations(buildingId)

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

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <div>
                <CardTitle>Building Details</CardTitle>
                <CardDescription>Building ID: {buildingId}</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Buildings
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Loading State */}
      {buildingSummaryLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading building data...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {buildingSummaryError && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              <p>
                Error loading building data. Please check the building ID and
                try again.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Building Data */}
      {buildingSummaryData && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="latest">Latest Calculation</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Building Overview</CardTitle>
                <CardDescription>
                  Building ID: {buildingSummaryData.building_id} • Total
                  Calculations: {buildingSummaryData.total_calculations}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Best Performance</p>
                      <p className="text-2xl font-bold">
                        {buildingSummaryData.best_performance_grade || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Avg Efficiency</p>
                      <p className="text-2xl font-bold">
                        {buildingSummaryData.average_efficiency_improvement?.toFixed(
                          1
                        ) || "N/A"}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Total Savings</p>
                      <p className="text-2xl font-bold">
                        {buildingSummaryData.total_cost_savings
                          ? formatCurrency(
                              buildingSummaryData.total_cost_savings
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="latest" className="space-y-4">
            {buildingSummaryData.latest_calculation ? (
              <div className="space-y-4">
                <EfficiencySummaryCards
                  summary={buildingSummaryData.latest_calculation.summary}
                />
                <PeriodBreakdown
                  periods={buildingSummaryData.latest_calculation.periods}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <p>No calculations found for this building.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {buildingCalculationsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading calculation history...</p>
                  </div>
                </CardContent>
              </Card>
            ) : buildingCalculationsData?.calculations ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Calculation History</CardTitle>
                    <CardDescription>
                      {buildingCalculationsData.total_count} calculations found
                    </CardDescription>
                  </CardHeader>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buildingCalculationsData.calculations.map(
                    (calculation, index) => (
                      <Card key={calculation.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            {calculation.measure_name}
                          </CardTitle>
                          <CardDescription>
                            {new Date(
                              calculation.calculation_timestamp
                            ).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Performance Grade:</span>
                            <span className="font-bold">
                              {calculation.summary.performance_grade}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Savings:</span>
                            <span className="font-bold text-green-600">
                              {formatCurrency(
                                calculation.summary.total_cost_savings
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Efficiency:</span>
                            <span className="font-bold">
                              {calculation.summary.overall_efficiency_improvement.toFixed(
                                1
                              )}
                              %
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <p>No calculation history found.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            {buildingSummaryData.latest_calculation ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EfficiencyChart
                  periods={buildingSummaryData.latest_calculation.periods}
                  chartType="bar"
                />
                <EfficiencyChart
                  periods={buildingSummaryData.latest_calculation.periods}
                  chartType="pie"
                />
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <p>No data available for charts.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
