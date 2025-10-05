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
  Search,
  X,
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
import { Input } from "@/components/ui/input"
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
  const [searchTerm, setSearchTerm] = useState("")
  const limit = 10 // Show 10 buildings per page

  const {
    allBuildingsSummaryData,
    allBuildingsSummaryLoading,
    allBuildingsSummaryError,
  } = useAllBuildingsSummary(page, limit, searchTerm || undefined)

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

  const filteredBuildings = allBuildingsSummaryData?.buildings || []

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPage(1) // Reset to first page when searching
  }

  const clearSearch = () => {
    setSearchTerm("")
    setPage(1)
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

  // Show no results found for search
  if (searchTerm && filteredBuildings.length === 0) {
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
                No buildings found matching "{searchTerm}"
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
            {/* Search Input */}
            <div className="flex items-center justify-start gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by building ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No buildings found matching your search criteria.</p>
              <Button
                variant="outline"
                onClick={clearSearch}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
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
              Showing {filteredBuildings.length} of{" "}
              {allBuildingsSummaryData.total_buildings} buildings
              {searchTerm && ` (filtered from ${allBuildingsSummaryData.buildings.length})`}
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
          {/* Search Input */}
          <div className="flex items-center justify-start gap-2">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by building ID..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="h-[600px] overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Building ID</TableHead>
                  <TableHead className="w-[120px]">Calculations</TableHead>
                  <TableHead className="w-[200px]">Latest Measure</TableHead>
                  <TableHead className="w-[120px]">Grade</TableHead>
                  <TableHead className="w-[120px]">Savings</TableHead>
                  <TableHead className="w-[120px]">Updated</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuildings.map((building) => (
                  <TableRow key={building.building_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{building.building_id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        {building.total_calculations}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="truncate block">
                        {building.latest_calculation?.measure_name || "N/A"}
                      </span>
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
                        className="flex items-center gap-1 text-xs px-2 py-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Fill remaining rows to maintain consistent height */}
                {Array.from({
                  length: Math.max(
                    0,
                    10 - filteredBuildings.length
                  ),
                }).map((_, index) => (
                  <TableRow key={`empty-${index}`} className="h-[60px]">
                    <TableCell colSpan={7} className="h-full"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
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
