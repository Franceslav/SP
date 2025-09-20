import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['error', 'warn'], // можно 'query' для отладки
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
        // Настройки для MongoDB Atlas
        // __internal: {
        //     engine: {
        //         binaryTargets: ['rhel-openssl-1.0.x'],
        //     },
        // },
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
