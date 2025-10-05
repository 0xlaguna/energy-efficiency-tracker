"use client"

import { useAuth } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const { signOut, loading } = useAuth()

  return (
    <Button onClick={signOut} disabled={loading} variant="outline">
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  )
}
