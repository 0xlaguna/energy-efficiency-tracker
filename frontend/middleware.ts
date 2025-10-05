import { NextRequest, NextResponse } from "next/server"

import { getAuthTokenFromRequest, validateToken } from "@/lib/auth-utils"

export async function middleware(request: NextRequest) {
  const token = getAuthTokenFromRequest(request)

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  const isValid = await validateToken(token)

  if (!isValid) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
