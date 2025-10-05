"use client"

import { useEffect } from "react"
import { MeStoreProvider } from "@/providers/me-store-provider"
import { MeState } from "@/stores/me-store"
import { signOut } from "@/lib/action"

import useInitialGetMe from "@/hooks/data/useGetInitialGetMe"
import { Icons } from "@/components/icons"

import LayoutEntry from "./layout-entry"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { getMeData, getMeLoading, getMeErrorData } = useInitialGetMe()

  useEffect(() => {
    if (getMeErrorData) {
      const data = getMeErrorData as Record<string, any>;
      if (data.response?.status === 404) {
        console.log("Will logout because of 404")
        signOut()
      }
    }
  }, [getMeErrorData])

  if (getMeLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Icons.spinner className="size-11 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  const state = {
    meInfo: getMeData,
  } satisfies MeState

  return (
    <MeStoreProvider state={state}>
      <LayoutEntry>{children}</LayoutEntry>
    </MeStoreProvider>
  )
}
