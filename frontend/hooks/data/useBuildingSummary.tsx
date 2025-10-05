"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { BuildingEfficiencySummary } from "@/types/v0/efficiency"
import { GET } from "@/lib/api/api-client"

const useBuildingSummary = (buildingId: string) => {
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
    BuildingEfficiencySummary,
    Error
  >({
    queryKey: ["efficiency-building-summary", buildingId],
    queryFn: () =>
      GET<BuildingEfficiencySummary>(
        `/efficiency/building/${buildingId}/summary`,
        {},
        headers
      ),
    enabled: !!token && !!buildingId,
  })

  return {
    buildingSummaryError: isError,
    buildingSummaryErrorData: error,
    buildingSummaryLoading: isLoading || !token,
    buildingSummarySuccess: isSuccess,
    buildingSummaryData: data,
  }
}

export default useBuildingSummary
