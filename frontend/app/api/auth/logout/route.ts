import { NextResponse } from "next/server"

import { clearAuthToken } from "@/lib/auth-utils"

export async function POST() {
  try {
    await clearAuthToken()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
