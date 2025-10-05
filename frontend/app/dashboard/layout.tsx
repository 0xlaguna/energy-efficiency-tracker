"use client"

import { MeStoreProvider } from "@/providers/me-store-provider"
import { MeState } from "@/stores/me-store"

import useInitialGetMe from "@/hooks/data/useGetInitialGetMe"
import { Icons } from "@/components/icons"

import LayoutEntry from "./layout-entry"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { getMeData, getMeLoading } = useInitialGetMe()

  console.log(getMeData)
  console.log(getMeLoading)

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
