"use client"

import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"

import {
  EfficiencyCalculation,
  EfficiencyFormData,
} from "@/types/v0/efficiency"
import { POST } from "@/lib/api/api-client"

const useMutateEfficiency = () => {
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
    "Content-Type": "application/json",
  }

  const { isError, isSuccess, mutate, isPending, data } = useMutation<
    EfficiencyCalculation,
    Error,
    EfficiencyFormData
  >({
    mutationFn: (efficiencyData) =>
      POST(`/efficiency/calculate`, efficiencyData, headers),
  })

  return {
    mutateEfficiencyError: isError,
    mutateEfficiencySuccess: isSuccess,
    mutateEfficiency: mutate,
    mutateEfficiencyPending: isPending,
    mutateEfficiencyData: data,
  }
}

export default useMutateEfficiency
