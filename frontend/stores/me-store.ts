import { createStore } from "zustand/vanilla"

import { MeInfo } from "@/types/v0/users"

export type MeState = {
  meInfo?: MeInfo
}

export type MeActions = {
  setMe: (meInfo: MeInfo) => void
  setAll: (meInfo: MeInfo) => void
}

export type MeStore = MeState & MeActions

export const initMeStore = (): MeState => {
  return { meInfo: undefined }
}

export const defaultInitState: MeState = {
  meInfo: undefined,
}

export const createMeStore = (initState: MeState = defaultInitState) => {
  return createStore<MeStore>()((set) => ({
    ...initState,
    setMe: (meInfo) => set((state) => ({ ...state, meInfo })),
    setAll: (meInfo) => set((_state) => ({ meInfo })),
  }))
}
