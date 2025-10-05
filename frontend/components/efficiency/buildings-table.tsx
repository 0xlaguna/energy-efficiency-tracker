"use client"

import { useState } from "react"
import {
  Building2,
  Calculator,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Plus,
} from "lucide-react"

import { PERFORMANCE_GRADE_COLORS } from "@/types/v0/efficiency"
import useAllBuildingsSummary from "@/hooks/data/useAllBuildingsSummary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BuildingsTableProps {
  className?: string
  onViewDetails?: (buildingId: string) => void
  onAddNew?: () => void
}

export default function BuildingsTable({
  className,
  onViewDetails,
  onAddNew,
}: BuildingsTableProps) {
  const [page, setPage] = useState(1)
  const limit = 10 // Show 10 buildings per page

  const {
    allBuildingsSummaryData,
    allBuildingsSummaryLoading,
    allBuildingsSummaryError,
  } = useAllBuildingsSummary(page, limit)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPerformanceGradeColor = (grade?: string) => {
    if (!grade) return "text-gray-500 bg-gray-50 border-gray-200"
    return (
      PERFORMANCE_GRADE_COLORS[
        grade as keyof typeof PERFORMANCE_GRADE_COLORS
      ] || "text-gray-500 bg-gray-50 border-gray-200"
    )
  }

  if (allBuildingsSummaryLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Buildings Summary
          </CardTitle>
          <CardDescription>Loading building efficiency data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (allBuildingsSummaryError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Buildings Summary
          </CardTitle>
          <CardDescription>Error loading building data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load buildings data</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (
    !allBuildingsSummaryData ||
    allBuildingsSummaryData.buildings.length === 0
  ) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Buildings Summary
          </CardTitle>
          <CardDescription>No buildings found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No buildings have efficiency calculations yet.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Buildings Summary
            </CardTitle>
            <CardDescription>
              Showing {allBuildingsSummaryData.buildings.length} of{" "}
              {allBuildingsSummaryData.total_buildings} buildings
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddNew}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[600px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Building ID</TableHead>
                  <TableHead>Total Calculations</TableHead>
                  <TableHead>Latest Measure</TableHead>
                  <TableHead>Performance Grade</TableHead>
                  <TableHead>Total Savings</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allBuildingsSummaryData.buildings.map((building) => (
                  <TableRow key={building.building_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {building.building_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        {building.total_calculations}
                      </div>
                    </TableCell>
                    <TableCell>
                      {building.latest_calculation?.measure_name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {building.best_performance_grade ? (
                        <Badge
                          variant="outline"
                          className={getPerformanceGradeColor(
                            building.best_performance_grade
                          )}
                        >
                          {building.best_performance_grade}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        {building.total_cost_savings
                          ? formatCurrency(building.total_cost_savings)
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(building.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails?.(building.building_id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Fill remaining rows to maintain consistent height */}
                {Array.from({
                  length: Math.max(
                    0,
                    10 - allBuildingsSummaryData.buildings.length
                  ),
                }).map((_, index) => (
                  <TableRow key={`empty-${index}`} className="h-[60px]">
                    <TableCell colSpan={7} className="h-full"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {allBuildingsSummaryData.page} of{" "}
              {allBuildingsSummaryData.total_pages} (
              {allBuildingsSummaryData.total_buildings} total buildings)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={!allBuildingsSummaryData.has_prev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!allBuildingsSummaryData.has_next}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
