"use client"

import { useState } from "react"
import { toast } from "sonner"

import BuildingDetails from "@/components/efficiency/building-details"
import BuildingsTable from "@/components/efficiency/buildings-table"
import EfficiencyForm from "@/components/efficiency/efficiency-form"

const TrackerPage = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  )
  const [showForm, setShowForm] = useState(false)

  const handleViewDetails = (buildingId: string) => {
    setSelectedBuildingId(buildingId)
    setShowForm(false)
  }

  const handleBackToBuildings = () => {
    setSelectedBuildingId(null)
    setShowForm(false)
  }

  const handleAddNew = () => {
    setShowForm(true)
    setSelectedBuildingId(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    toast.success("Data saved successfully!")
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            {showForm ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Add New Building Calculation
                  </h2>
                  <button
                    onClick={handleBackToBuildings}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Buildings
                  </button>
                </div>
                <EfficiencyForm onSuccess={handleFormSuccess} />
              </div>
            ) : selectedBuildingId ? (
              <BuildingDetails
                buildingId={selectedBuildingId}
                onBack={handleBackToBuildings}
              />
            ) : (
              <BuildingsTable
                onViewDetails={handleViewDetails}
                onAddNew={handleAddNew}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackerPage
