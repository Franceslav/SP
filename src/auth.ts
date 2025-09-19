import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/config/prisma";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: 'jwt' },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token, user }) {
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
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            },
        }),
    ],
})