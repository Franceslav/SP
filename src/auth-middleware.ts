import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Конфигурация NextAuth для middleware (без Prisma)
export const { auth } = NextAuth({
    session: { strategy: 'jwt' },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
            }
            return session
        },
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async () => {
                // В middleware мы не можем использовать Prisma
                // Поэтому просто возвращаем null для авторизации
                // Реальная авторизация будет происходить в API routes
                return null
            },
        }),
    ],
})
