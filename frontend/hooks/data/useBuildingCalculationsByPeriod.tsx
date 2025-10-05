"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { BuildingCalculationsResponse } from "@/types/v0/efficiency"
import { GET } from "@/lib/api/api-client"

const useBuildingCalculationsByPeriod = (
  buildingId: string,
  period: string
) => {
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
    queryKey: [
      "efficiency-building-calculations-by-period",
      buildingId,
      period,
    ],
    queryFn: () =>
      GET<BuildingCalculationsResponse>(
        `/efficiency/building/${buildingId}/period/${period}`,
        {},
        headers
      ),
    enabled: !!token && !!buildingId && !!period,
  })

  return {
    buildingCalculationsByPeriodError: isError,
    buildingCalculationsByPeriodErrorData: error,
    buildingCalculationsByPeriodLoading: isLoading || !token,
    buildingCalculationsByPeriodSuccess: isSuccess,
    buildingCalculationsByPeriodData: data,
  }
}

export default useBuildingCalculationsByPeriod
