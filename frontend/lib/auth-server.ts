import { getAuthToken, validateToken } from "@/lib/auth-utils"

export async function getServerSession() {
  const token = await getAuthToken()

  if (!token) {
    return null
  }

  const isValid = await validateToken(token)

  if (!isValid) {
    return null
  }

  return {
    token,
    isAuthenticated: true,
  }
}

export async function requireAuth() {
  const session = await getServerSession()

  if (!session) {
    throw new Error("Authentication required")
  }

  return session
}
