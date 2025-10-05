import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export const AUTH_COOKIE_NAME = "auth-token"

export async function setAuthToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_NAME)?.value || null
}

export async function clearAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export function getAuthTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value || null
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    if (!token || token.length === 0) {
      return false
    }

    return true
  } catch (error) {
    console.error("Token validation error:", error)
    return false
  }
}
