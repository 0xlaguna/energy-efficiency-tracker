"use server"

import { redirect } from "next/navigation"

import { setAuthToken } from "@/lib/auth-utils"

export const signIn = async (prevState: any, formData: FormData) => {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    )

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    const data = await response.json()

    if (data.access_token) {
      await setAuthToken(data.access_token)
      redirect("/dashboard")
    } else {
      throw new Error("No token received from API")
    }
  } catch (error) {
    // Don't catch redirect errors - let them bubble up
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    console.error("Sign in error:", error)
    throw new Error("Invalid credentials")
  }
}

export const signOut = async () => {
  // Clear the auth token
  const { clearAuthToken } = await import("@/lib/auth-utils")
  await clearAuthToken()
  redirect("/auth")
}
