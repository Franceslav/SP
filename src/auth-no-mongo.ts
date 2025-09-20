import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/config/prisma-simple";
import bcrypt from "bcryptjs";
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

// Временная конфигурация без MongoDB адаптера для тестирования
export const authOptions = {
    secret: process.env.AUTH_SECRET,
    session: { strategy: 'jwt' as const },
    callbacks: {
        async session({ session, token }: { session: Session, token: JWT }) {
            if (session.user) {
                session.user.id = token.sub as string
            }
            return session
        },
        async jwt({ token, user }: { token: JWT, user: User }) {
            if (user) {
                token.sub = user.id
            }
            return token
        },
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string },
                    })

                    if (!user || !user.password) {
                        return null
                    }

                    const isValid = await bcrypt.compare(credentials.password as string, user.password)
                    if (!isValid) {
                        return null
                    }

                    return {
                        id: user.id,
                        name: user.name ?? undefined,
                        email: user.email ?? undefined,
                        image: user.image ?? undefined,
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            },
        }),
    ],
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
