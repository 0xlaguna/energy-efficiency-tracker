"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { MeInfo } from "@/types/v0/users"
import { GET } from "@/lib/api/api-client"

const useInitialGetMe = () => {
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
    MeInfo,
    Error
  >({
    queryKey: ["users-initial-getme"],
    queryFn: () => GET<MeInfo>("/users/me", {}, headers),
    enabled: !!token,
  })

  return {
    getMeError: isError,
    getMeErrorData: error,
    getMeLoading: isLoading || !token,
    getMeSuccess: isSuccess,
    getMeData: data,
    getMeSession: bearerToken,
  }
}

export default useInitialGetMe
