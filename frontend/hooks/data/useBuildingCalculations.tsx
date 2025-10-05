"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { BuildingCalculationsResponse } from "@/types/v0/efficiency"
import { GET } from "@/lib/api/api-client"

const useBuildingCalculations = (buildingId: string) => {
  const [bearerToken, setBearerToken] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          setBearerToken(data.token)
        }
      })
      .catch(() => setBearerToken(null))
  }, [])

  const token = bearerToken as string
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const { isError, error, isLoading, isSuccess, data, refetch } = useQuery<
    BuildingCalculationsResponse,
    Error
  >({
    queryKey: ["efficiency-building-calculations", buildingId],
    queryFn: () =>
      GET<BuildingCalculationsResponse>(
        `/efficiency/building/${buildingId}`,
        {},
        headers
      ),
    enabled: !!token && !!buildingId,
  })

  return {
    buildingCalculationsError: isError,
    buildingCalculationsErrorData: error,
    buildingCalculationsLoading: isLoading || !token,
    buildingCalculationsSuccess: isSuccess,
    buildingCalculationsData: data,
  }
}

export default useBuildingCalculations
