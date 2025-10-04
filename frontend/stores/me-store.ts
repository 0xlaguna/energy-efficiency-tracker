import { Session } from "next-auth"
import { createStore } from "zustand/vanilla"

import { MeInfo } from "@/types/v0/users"

export type MeState = {
  meInfo?: MeInfo
  session: Session | null
}

export type MeActions = {
  setMe: (meInfo: MeInfo) => void
  setSession: (session: Session) => void
  setAll: (meInfo: MeInfo, session: Session) => void
}

export type MeStore = MeState & MeActions

export const initMeStore = (): MeState => {
  return { meInfo: undefined, session: null }
}

export const defaultInitState: MeState = {
  meInfo: undefined,
  session: null,
}

export const createMeStore = (initState: MeState = defaultInitState) => {
  return createStore<MeStore>()((set) => ({
    ...initState,
    setMe: (meInfo) => set((state) => ({ ...state, meInfo })),
    setSession: (session) => set((state) => ({ ...state, session })),
    setAll: (meInfo, session) => set((_state) => ({ session, meInfo })),
  }))
}
