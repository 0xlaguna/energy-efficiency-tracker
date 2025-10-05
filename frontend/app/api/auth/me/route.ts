import { NextResponse } from "next/server"

import { getServerSession } from "@/lib/auth-server"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      isAuthenticated: true,
      token: session.token,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
