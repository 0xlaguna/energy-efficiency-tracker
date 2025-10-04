// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    token: string
    user_id: string
  }

  interface Session {
    accessToken: string
    user: {
      argonToken: string
      id: string
    } & DefaultSession["user"]
  }

  interface JWT {
    accessToken: string
    argonToken: string
    userId: string
  }
}
