import { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const config = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.AUTH_DEBUG === "true",

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required")
          }

          const email = credentials.email as string
          const password = credentials.password as string

          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.password) {
            console.error("Auth Fail: User not found or no password")
            throw new Error("Invalid credentials")
          }

          const valid = await bcrypt.compare(password, user.password)
          if (!valid) {
            console.error("Auth Fail: Invalid password")
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        } catch (error) {
          console.error("Auth Error (authorize):", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "credentials") {
          return true
        }

        const email = user.email!

        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { accounts: true },
        })

        if (existingUser) {
          const alreadyLinked = existingUser.accounts.some(
            (acc) => acc.provider === account?.provider
          )

          if (!alreadyLinked) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account!.provider,
                providerAccountId: account!.providerAccountId,
                type: account!.type,
                access_token: account!.access_token ?? null,
                refresh_token: account!.refresh_token ?? null,
                expires_at: account!.expires_at ?? null,
                token_type: account!.token_type ?? null,
                scope: account!.scope ?? null,
                id_token: typeof account!.id_token === "string" ? account!.id_token : null,
                session_state: typeof account!.session_state === "string" ? account!.session_state : null,
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error("Auth Error (signIn):", error)
        return false
      }
    },

    async jwt({ token, user, trigger, session }) {
      try {
        if (user) {
          token.id = user.id
          token.role = user.role
        }

        if (trigger === "update" && session) {
          token.name = session.user.name
          token.email = session.user.email
        }

        if (token.email && !token.role) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true }
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        }

        return token
      } catch (error) {
        console.error("Auth Error (jwt):", error)
        return token
      }
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
} as NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
