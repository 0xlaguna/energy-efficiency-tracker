"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { AllBuildingsSummaryResponse } from "@/types/v0/efficiency"
import { GET } from "@/lib/api/api-client"

const useAllBuildingsSummary = (page: number, limit: number, search?: string) => {
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
    AllBuildingsSummaryResponse,
    Error
  >({
    queryKey: ["efficiency-all-buildings-summary", page, limit, search],
    queryFn: () =>
      GET<AllBuildingsSummaryResponse>(
        `/efficiency/buildings`,
        { page, limit, search },
        headers
      ),
    enabled: !!token && !!page && !!limit,
  })

  return {
    allBuildingsSummaryError: isError,
    allBuildingsSummaryErrorData: error,
    allBuildingsSummaryLoading: isLoading || !token,
    allBuildingsSummarySuccess: isSuccess,
    allBuildingsSummaryData: data,
  }
}

export default useAllBuildingsSummary
