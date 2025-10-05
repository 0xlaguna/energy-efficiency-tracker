"use client"

import { useTransition } from "react"
import { signOut } from "@/lib/action"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const [pending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(() => {
      signOut()
    })
  }

  return (
    <Button onClick={handleSignOut} disabled={pending} variant="outline">
      {pending ? "Signing out..." : "Sign Out"}
    </Button>
  )
}
