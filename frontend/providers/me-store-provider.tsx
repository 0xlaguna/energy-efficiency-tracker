"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { createMeStore, type MeState, type MeStore } from "@/stores/me-store"
import { useStore } from "zustand"

export type MeStoreApi = ReturnType<typeof createMeStore>

export const MeStoreContext = createContext<MeStoreApi | undefined>(undefined)

export interface MeStoreProviderProps {
  children: ReactNode
  state: MeState
}

export const MeStoreProvider = ({ children, state }: MeStoreProviderProps) => {
  const storeRef = useRef<MeStoreApi>(createMeStore(state))
  
  if (!storeRef.current) {
    storeRef.current = createMeStore(state)
  }

  return (
    <MeStoreContext.Provider value={storeRef.current}>
      {children}
    </MeStoreContext.Provider>
  )
}

export const useMeStore = <T,>(selector: (store: MeStore) => T): T => {
  const meStoreContext = useContext(MeStoreContext)

  if (!meStoreContext) {
    throw new Error(`useMeStore must be used within MeStoreProvider`)
  }

  return useStore(meStoreContext, selector)
}
