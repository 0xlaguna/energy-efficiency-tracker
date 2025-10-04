import { authConfig } from "@/auth.config"
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

const config = {
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials: Record<string, unknown>) {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/auth/login",
            {
              method: "POST",
              body: JSON.stringify(parsedCredentials.data),
              headers: { "Content-Type": "application/json" },
            }
          )

          const session = await res.json()

          if (res.ok && session) {
            return session
          }
          return null
        }
        return null
      },
    }),
  ],
  callbacks: {
    // @ts-ignore
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken
      }
      return token
    },
  },
} satisfies NextAuthConfig

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)
